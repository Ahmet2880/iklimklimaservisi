'use client'
import { useState, useEffect } from 'react'
import MarkdownViewer from '../../components/MarkdownViewer'

export default function AdminPanel() {
  const [scans, setScans] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('/admin_exports/index.json')
      .then(res => res.json())
      .then(data => setScans(data))
  }, [])

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.url.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'warn' ? scan.warn > 0 :
      filter === 'fail' ? scan.fail > 0 :
      true
    return matchesSearch && matchesFilter
  })

  function handleExport(scan) {
    const jsonBlob = new Blob([JSON.stringify(scan, null, 2)], { type: 'application/json' })
    const mdContent = `
# Güvenlik Raporu: ${scan.url}

**Tarih:** ${scan.timestamp}  
**Toplam URL:** ${scan.numUrls}  
**Geçilen Kontroller:** ${scan.pass}  
**Uyarılar:** ${scan.warn}  
**Hatalar:** ${scan.fail}

## Tespit Edilen Uyarılar
${scan.alerts.map(a => `- **${a.name}**\n  Risk: ${a.risk}\n  Örnek Sayısı: ${a.instances}`).join('\n')}
    `
    const mdBlob = new Blob([mdContent], { type: 'text/markdown' })

    const jsonUrl = URL.createObjectURL(jsonBlob)
    const mdUrl = URL.createObjectURL(mdBlob)

    const jsonLink = document.createElement('a')
    jsonLink.href = jsonUrl
    jsonLink.download = `${scan.url.replace(/^https?:\/\//, '')}.json`
    jsonLink.click()

    const mdLink = document.createElement('a')
    mdLink.href = mdUrl
    mdLink.download = `${scan.url.replace(/^https?:\/\//, '')}.md`
    mdLink.click()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tarama Geçmişi</h1>

      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          placeholder="URL ara..."
          className="border px-3 py-1 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-1 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Tümü</option>
          <option value="warn">Uyarı {'>'} 0</option>
          <option value="fail">Hata {'>'} 0</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Tarih</th>
            <th className="border px-2 py-1">URL</th>
            <th className="border px-2 py-1">Uyarı</th>
            <th className="border px-2 py-1">Hata</th>
            <th className="border px-2 py-1">Detay</th>
          </tr>
        </thead>
        <tbody>
          {filteredScans.map((scan, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{scan.timestamp}</td>
              <td className="border px-2 py-1">{scan.url}</td>
              <td className="border px-2 py-1">{scan.warn}</td>
              <td className="border px-2 py-1">{scan.fail}</td>
              <td className="border px-2 py-1">
                <button className="text-blue-600 underline" onClick={() => setSelected(scan)}>
                  Görüntüle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-2">{selected.url}</h2>
          <p>Toplam URL: {selected.numUrls}</p>
          <p>Geçilen Kontroller: {selected.pass}</p>
          <p>Uyarılar: {selected.warn}</p>
          <p>Hatalar: {selected.fail}</p>

          <h3 className="mt-4 font-semibold">Uyarılar:</h3>
          <ul className="list-disc ml-6">
            {selected.alerts.map((a, i) => (
              <li key={i}>
                <strong>{a.name}</strong> – {a.risk} risk ({a.instances} örnek)
              </li>
            ))}
          </ul>

          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => handleExport(selected)}
          >
            Export Et (JSON + Markdown)
          </button>

          <MarkdownViewer url={`/admin_exports/raporlar/${selected.url.replace(/^https?:\/\//, '')}.md`} />
        </div>
      )}
    </div>
  )
}
