import React, { useState, useRef } from 'react'
import { CloudUpload, FileText, X, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import InputField from './Inputfield'

const FileUploadBox = ({ label, file, setFile, isRequired }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const processFile = (newFile) => {
    const isValid = 
        newFile.type === 'application/pdf' || 
        newFile.name.endsWith('.pdf') ||
        newFile.name.endsWith('.xlsx') || 
        newFile.name.endsWith('.xls') || 
        newFile.name.endsWith('.csv') ||
        newFile.type.includes('excel') || 
        newFile.type.includes('spreadsheet') || 
        newFile.type.includes('csv')

    if (!isValid) {
      toast.error('Please select valid PDF or Excel files only.')
      return
    }
    
    setFile(newFile)
  }

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
  }

  return (
    <div 
      className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-[#1a1a1a]/50 transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-sky-200 hover:border-sky-300'
      } cursor-pointer min-h-[200px] relative w-full`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !file && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.xlsx,.xls,.csv" 
        className="hidden" 
      />
      
      <div className="absolute top-3 left-3 bg-[#111] border border-sky-200 text-sky-800 text-[11px] px-3 py-1 rounded-full z-10 flex items-center gap-1">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </div>

      {file ? (
        <div 
          className="relative flex flex-col items-center bg-sky-100 p-4 rounded-xl border border-sky-200 hover:border-blue-500/30 transition-colors group mt-4 w-full max-w-[160px]"
          onClick={(e) => e.stopPropagation()}
        >
          <FileText className="w-10 h-10 text-blue-400 mb-3" />
          <button 
            onClick={removeFile}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
            title="Remove file"
          >
            <X className="w-4 h-4 text-sky-950" />
          </button>
          <h3 className="text-[13px] text-gray-900 truncate w-full text-center" title={file.name}>
            {file.name}
          </h3>
          <p className="text-[11px] text-sky-600 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <div className="w-12 h-12 flex items-center justify-center mb-3">
            <CloudUpload className={`w-8 h-8 ${isDragging ? 'text-blue-400' : 'text-sky-700'}`} strokeWidth={1.5} />
          </div>
          <h3 className="text-[13px] text-sky-800 mb-1">
            {isDragging ? 'Drop here' : 'Click or drag file'}
          </h3>
          <p className="text-[11px] text-sky-600 text-center">PDF or Excel</p>
        </div>
      )}
    </div>
  )
}

const UploadPdf = () => {
  const [agentName, setAgentName] = useState('')
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
    formData.append('agent_name', agentName)
    formData.append('rules_file', rulesFile)
    formData.append('menu_file', menuFile)

    createAgentMutation.mutate(formData)
  }

  const isFormValid = agentName.trim() && rulesFile && menuFile

  return (
    <div className="bg-sky-50 p-6 rounded-xl border border-sky-200 relative">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-sky-950 mb-2">Create AI Agent</h2>
        <p className="text-sm text-sky-700 mb-6">
          Upload documents (PDF or Excel) with text that will be used to train your AI text model. <br/>
        </p>

        <div className="mb-6">
          <InputField
            label="Agent Name"
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            labelClass="!text-sm !font-medium !text-sky-800"
            inputClass="!w-full !bg-sky-50 !border !border-[#272727] !rounded-xl !px-4 !py-3 !text-sky-950 !text-sm focus:!outline-none focus:!border-blue-500 !transition-colors"
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
              ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md hover:shadow-lg cursor-pointer' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
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
