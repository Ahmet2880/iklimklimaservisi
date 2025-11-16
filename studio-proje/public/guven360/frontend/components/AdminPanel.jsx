import { useRouter } from 'next/router'

export default function AdminPanel({ alerts }) {
  const router = useRouter()

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🛡️ Tarama Sonuçları</h2>

      <button
        onClick={() => router.push('/zafiyet-editor')}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Yeni Eğitim Ekle
      </button>

      {alerts.map((alert, i) => (
        <div key={i} className="border p-2 mb-2 rounded bg-gray-100">
          <strong>{alert.alert}</strong> – {alert.risk}
          <br />
          <a href={`/education?type=${encodeURIComponent(alert.alert)}`} className="text-blue-600 underline">
            Eğitim Kartını Gör
          </a>
        </div>
      ))}
    </div>
  )
}
