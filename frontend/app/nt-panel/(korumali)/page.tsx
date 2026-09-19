// Aşama 3 doğrulaması için minimal bir gövde — gerçek stat kartları
// (blog/S.S.S./referans sayıları, bekleyen teklif, 24s hata) Faz 4 Aşama
// 4'te buraya eklenecek (bkz. plan).
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif", color: 'var(--text-primary)' }}>
        Hoş Geldiniz
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Sol menüden yönetmek istediğiniz bölümü seçin.
      </p>
    </div>
  )
}
