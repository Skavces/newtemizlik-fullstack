import PageHero from '@/components/ui/PageHero'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'KVKK Aydınlatma Metni | New Temizlik',
  description: 'New Temizlik Hizmetleri 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni.',
  canonical: '/kvkk',
  imageAlt: 'New Temizlik KVKK aydınlatma metni',
})

export default function KvkkPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'KVKK Aydınlatma Metni', item: `${SITE_URL}/kvkk` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="KVKK Aydınlatma Metni"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'KVKK Aydınlatma Metni' },
        ]}
      />

      <article className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12" style={{ padding: '48px 0 80px' }}>
        <div className="blog-content">
          <p>
            New Temizlik Hizmetleri (&quot;Şirket&quot;) olarak, 6698 sayılı Kişisel Verilerin
            Korunması Kanunu (&quot;KVKK&quot;) kapsamında veri sorumlusu sıfatıyla, kişisel
            verilerinizin güvenliğine ve mevzuata uygun şekilde işlenmesine önem veriyoruz. Bu
            aydınlatma metni, web sitemiz üzerinden sunulan iletişim formu, canlı destek (yapay
            zekâ danışmanı) ve diğer kanallar aracılığıyla elde ettiğimiz kişisel verilerin hangi
            amaçla, hangi hukuki sebeple işlendiğini ve haklarınızı bilgilendirmek amacıyla
            hazırlanmıştır.
          </p>

          <h2>1. Veri Sorumlusu</h2>
          <p>
            Kişisel verileriniz, veri sorumlusu sıfatıyla New Temizlik Hizmetleri tarafından,
            aşağıda açıklanan kapsamda işlenmektedir.
          </p>
          <p>
            Adres: Atatürk Mah. İzgin Sk. No:4 Soma/Manisa
            <br />
            E-posta: info@newtemizlik.com.tr
            <br />
            Telefon: +90 530 473 87 93
          </p>

          <h2>2. İşlenen Kişisel Veriler</h2>
          <p>Web sitemiz üzerinden aşağıdaki kişisel veri kategorileri işlenebilmektedir:</p>
          <ul>
            <li>
              <strong>Kimlik ve iletişim bilgileri:</strong> İletişim formunu doldurduğunuzda
              paylaştığınız ad-soyad, telefon numarası ve (verilmişse) e-posta adresiniz.
            </li>
            <li>
              <strong>Talep/işlem bilgileri:</strong> Teklif talebinize ilişkin panel adedi, saha
              büyüklüğü ve su ulaşımı gibi hizmetle ilgili bilgiler.
            </li>
            <li>
              <strong>İşlem güvenliği bilgileri:</strong> Yapay zekâ destekli sohbet asistanıyla
              yaptığınız görüşme kayıtları ve varsa görüşme sonunda verdiğiniz memnuniyet puanı.
            </li>
            <li>
              <strong>Kullanım bilgileri:</strong> Web sitesi kullanım istatistikleri (sayfa
              görüntüleme, tıklama gibi anonimleştirilmiş/toplulaştırılmış analiz verileri).
            </li>
          </ul>

          <h2>3. İşleme Amaçları</h2>
          <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
          <ul>
            <li>Talep ettiğiniz hizmete ilişkin teklif hazırlanması ve tarafınızla iletişime geçilmesi,</li>
            <li>Yapay zekâ destekli sohbet asistanı aracılığıyla size en uygun hizmetin belirlenmesi ve talebinizin ilgili ekibe iletilmesi,</li>
            <li>Sunulan hizmetlerin ve müşteri danışmanlığı sürecinin kalitesinin ölçülmesi, geliştirilmesi,</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi ve olası uyuşmazlıklarda delil teşkil etmesi,</li>
            <li>Web sitesi performansının ve kullanıcı deneyiminin analiz edilerek iyileştirilmesi.</li>
          </ul>

          <h2>4. Hukuki Sebep</h2>
          <p>
            Kişisel verileriniz, KVKK&apos;nın 5. maddesinde yer alan &quot;ilgili kişinin açık
            rızasının bulunması&quot;, &quot;bir sözleşmenin kurulması veya ifasıyla doğrudan
            doğruya ilgili olması&quot; ve &quot;veri sorumlusunun meşru menfaati için veri
            işlenmesinin zorunlu olması&quot; hukuki sebeplerine dayanılarak işlenmektedir.
          </p>

          <h2>5. Saklama Süresi</h2>
          <p>
            İletişim formu ve sohbet asistanı aracılığıyla elde edilen kimlik/iletişim
            verileriniz, işleme amacının ortadan kalkmasını takiben en geç <strong>12 ay</strong>{' '}
            içinde sistemlerimizden otomatik olarak anonim hâle getirilir; kayıt tamamen
            silinmek yerine kimliğinizi belirleyen alanlar (ad-soyad, telefon, e-posta) kalıcı
            olarak boşaltılır, geri kalan istatistiksel veriler anonim olarak saklanmaya devam
            edebilir.
          </p>

          <h2>6. Kişisel Verilerin Aktarılması</h2>
          <p>
            Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesiyle sınırlı
            olarak; hizmet aldığımız barındırma/altyapı sağlayıcıları ve yasal olarak
            yetkili kamu kurum ve kuruluşları ile, KVKK&apos;nın 8. ve 9. maddelerinde
            öngörülen şartlara uygun şekilde paylaşılabilir. Kişisel verileriniz yurt dışına
            aktarılmamaktadır.
          </p>

          <h2>7. Haklarınız</h2>
          <p>KVKK&apos;nın 11. maddesi uyarınca bize başvurarak;</p>
          <ul>
            <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>KVKK&apos;nın 7. maddesindeki şartlar çerçevesinde silinmesini/yok edilmesini isteme,</li>
            <li>Düzeltme/silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme,</li>
            <li>Münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
            <li>Kanuna aykırı işlenme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
          </ul>
          <p>
            haklarına sahipsiniz. Bu haklarınıza ilişkin taleplerinizi{' '}
            <a href="mailto:info@newtemizlik.com.tr">info@newtemizlik.com.tr</a> adresine
            yazılı olarak iletebilirsiniz.
          </p>
        </div>
      </article>
    </>
  )
}
