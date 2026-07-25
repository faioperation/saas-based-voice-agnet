import React, { useState, useRef } from 'react'
import { CloudUpload, FileText, X, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import InputField from './Inputfield'
import Dropdown from './Dropdown'
import FileUploadBox from './FileUploadBox'
const UploadPdf = () => {
  const [agentName, setAgentName] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [rulesFile, setRulesFile] = useState(null)
  const [menuFile, setMenuFile] = useState(null)
  
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const createAgentMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosSecure.post('/agent/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Agent created and provisioned successfully')
      setRulesFile(null)
      setMenuFile(null)
      setAgentName('')
      queryClient.invalidateQueries(['recentAgents'])
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create agent')
    }
  })

  const handleApply = () => {
    if (!agentName.trim()) {
      toast.error('Please enter an agent name')
      return
    }
    if (!rulesFile || !menuFile) {
      toast.error('Please upload at least Rules File and Menu File')
      return
    }

    const formData = new FormData()
    formData.append('tenant_id', tenantId)
    formData.append('agent_name', agentName)
    formData.append('rules_file', rulesFile)
    formData.append('menu_file', menuFile)

    createAgentMutation.mutate(formData)
  }

  const isFormValid = agentName.trim() && rulesFile && menuFile

  return (
    <div className="bg-white shadow-[0_4px_20px_rgba(14,165,233,0.08)] p-6 rounded-2xl border border-sky-100 relative">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-sky-950 mb-2">Create AI Agent</h2>
        <p className="text-sm text-sky-700 mb-6">
          Upload documents (PDF or Excel) with text that will be used to train your AI text model. <br/>
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

          <InputField
            label="Agent Name"
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            labelClass="!text-sm !font-medium !text-sky-800"
            inputClass="!w-full !bg-white !border !border-sky-200 !rounded-xl !px-4 !py-3 !text-sky-950 !text-sm focus:!outline-none focus:!border-sky-400 !transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <FileUploadBox label="Rules" file={rulesFile} setFile={setRulesFile} isRequired={true} />
        <FileUploadBox label="Menu" file={menuFile} setFile={setMenuFile} isRequired={true} />
      </div>

      <div className="absolute bottom-6 right-6">
        <button 
          onClick={handleApply}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-lg cursor-pointer' 
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
          disabled={!isFormValid || createAgentMutation.isPending}
        >
          {createAgentMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {createAgentMutation.isPending ? 'Creating Agent...' : 'Create Agent'}
        </button>
      </div>
    </div>
  )
}

export default UploadPdf
