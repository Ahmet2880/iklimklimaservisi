import { useState } from 'react'

export default function ZafiyetEditor() {
  const [markdown, setMarkdown] = useState('')
  const [jsonOutput, setJsonOutput] = useState(null)

  const convertToJSON = () => {
    const lines = markdown.split('\n')
    const obj = {
      alert: lines[0]?.replace('# ', '').trim(),
      description: lines[1]?.trim(),
      solution: lines[2]?.trim(),
      level: lines[3]?.trim(),
      code: {
        unsafe: lines[4]?.replace('Güvensiz:', '').trim(),
        safe: lines[5]?.replace('Güvenli:', '').trim()
      },
      related: lines.slice(6).map(l => l.trim()).filter(Boolean)
    }
    setJsonOutput(obj)
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🎓 Zafiyet Kartı Oluşturucu</h2>
      <textarea
        rows={10}
        value={markdown}
        onChange={e => setMarkdown(e.target.value)}
        placeholder={`# SQL Injection\nVeri sızabilir...\nParametrik sorgu kullan\nİleri\nGüvensiz: SELECT * FROM ...\nGüvenli: SELECT * WHERE id = ?\nBlind SQLi\nUnion SQLi`}
        className="w-full border p-2 mb-4"
      />
      <button onClick={convertToJSON} className="bg-blue-600 text-white px-4 py-2 rounded">
        JSON'a Dönüştür
      </button>
      {jsonOutput && (
        <pre className="bg-gray-100 p-4 mt-4 rounded text-sm whitespace-pre-wrap">
          {JSON.stringify(jsonOutput, null, 2)}
        </pre>
      )}
    </div>
  )
}
