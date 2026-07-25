import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import FileUploadBox from './FileUploadBox'
import Dropdown from './Dropdown'

const SpecialOfferUpload = () => {
  const [tenantId, setTenantId] = useState('')
  const [agentId, setAgentId] = useState('')
  const [specialOfferFile, setSpecialOfferFile] = useState(null)
  
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const uploadSpecialOfferMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosSecure.post('/agent/special-offer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Special offer uploaded successfully')
      setSpecialOfferFile(null)
      setTenantId('')
      setAgentId('')
      queryClient.invalidateQueries(['specialOffers'])
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to upload special offer')
    }
  })

  const handleApply = () => {
    if (!tenantId) {
      toast.error('Please select a tenant')
      return
    }
    if (!agentId) {
      toast.error('Please select an agent')
      return
    }
    if (!specialOfferFile) {
      toast.error('Please upload a Special Offers File')
      return
    }

    const formData = new FormData()
    formData.append('tenant_id', tenantId)
    formData.append('agent_id', agentId)
    formData.append('file', specialOfferFile)

    uploadSpecialOfferMutation.mutate(formData)
  }

  const isFormValid = tenantId && agentId && specialOfferFile

  return (
    <div className="bg-white shadow-[0_4px_20px_rgba(14,165,233,0.08)] p-6 rounded-2xl border border-sky-100 relative min-h-[400px] flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-sky-950 mb-2">Upload Special Offer</h2>
        <p className="text-sm text-sky-700 mb-6">
          Upload special offer documents (PDF or Excel) for your AI agent.
        </p>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-50">
          <div className="w-full">
            <Dropdown
              label="Select Tenant"
              placeholder="-- Select Tenant --"
              options={[
                { value: "1", label: "Tenant 1" },
                { value: "2", label: "Tenant 2" }
              ]}
              value={tenantId}
              onSelect={setTenantId}
              labelClass="!text-sm !font-medium !text-sky-800"
              inputClass="!w-full !bg-white !border !border-sky-200 !rounded-xl !px-4 !py-3 !text-sky-950 !text-sm focus:!outline-none focus:!border-sky-400 !transition-colors"
              optionClass="border-sky-100 shadow-xl"
            />
          </div>

          <div className="w-full">
            <Dropdown
              label="Select Agent"
              placeholder="-- Select Agent --"
              options={[
                { value: "1", label: "Agent 1" },
                { value: "2", label: "Agent 2" }
              ]}
              value={agentId}
              onSelect={setAgentId}
              labelClass="!text-sm !font-medium !text-sky-800"
              inputClass="!w-full !bg-white !border !border-sky-200 !rounded-xl !px-4 !py-3 !text-sky-950 !text-sm focus:!outline-none focus:!border-sky-400 !transition-colors"
              optionClass="border-sky-100 shadow-xl z-30"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <FileUploadBox label="Special Offers" file={specialOfferFile} setFile={setSpecialOfferFile} isRequired={true} />
      </div>

      <div className="absolute bottom-6 right-6">
        <button 
          onClick={handleApply}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-lg cursor-pointer' 
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
          disabled={!isFormValid || uploadSpecialOfferMutation.isPending}
        >
          {uploadSpecialOfferMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {uploadSpecialOfferMutation.isPending ? 'Uploading...' : 'Upload Special Offer'}
        </button>
      </div>
    </div>
  )
}

export default SpecialOfferUpload
