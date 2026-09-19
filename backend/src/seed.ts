import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { BlogPost } from './blog/entities/blog-post.entity'
import { Faq } from './faq/entities/faq.entity'
import { Reference } from './references/entities/reference.entity'

config()

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'newtemizlik',
  entities: [BlogPost, Faq, Reference],
})

// Eski NewTemizlik (React+Vite) sitesinden birebir taşınan içerik — başlık,
// slug ve meta description SEO paritesi için değiştirilmeden korunuyor.
// Görseller repoda tutulmuyor: coverImage/logo yolları Next.js public/'a
// taşınacak eski site asset'lerini işaret ediyor (bkz. plan Faz 2/6).
const PUBLISHED_AT = new Date('2026-04-14T00:00:00+03:00')

const BLOG_POSTS = [
  {
    slug: 'gunes-paneli-temizligi-ne-zaman-yapilmali',
    title: 'Güneş Paneli Temizliği Ne Zaman Yapılmalı? Mevsimlik Rehber',
    excerpt: 'İlkbahar, yaz, sonbahar ve kış için mevsimlik temizlik takvimi. Bölgenize ve santral büyüklüğünüze göre doğru temizlik sıklığını öğrenin.',
    metaDescription: 'Güneş paneli temizliğinin ne zaman ve ne sıklıkla yapılması gerektiğini öğrenin. İlkbahar, yaz, sonbahar ve kış için mevsimlik temizlik takvimi rehberi.',
    coverImage: '/endustriyel-gunes-paneli-yikama.jpeg',
    sortOrder: 0,
    content: `
<p>Güneş panellerinin temizlik sıklığı, santralinizin bulunduğu coğrafyaya, çevresel kirlilik düzeyine ve yıllık üretim hedeflerinize göre değişir. Yanlış zamanda ya da çok seyrek yapılan temizlik, beklenenden çok daha büyük üretim kayıplarına yol açabilir.</p>
<p>Bu rehberde mevsimlik temizlik takvimini ve Türkiye'deki farklı bölgeler için özel koşulları ele alıyoruz.</p>
<h2>Genel Kural: Yılda En Az 2–4 Kez</h2>
<p>Uluslararası GES işletme standartlarına göre güneş panellerinin yılda en az <strong>2 kez</strong> profesyonel temizlikten geçirilmesi önerilmektedir. Ancak Türkiye'nin büyük bölümünde, özellikle Ege, Marmara ve İç Anadolu'daki tarımsal ve sanayi bölgelerinde bu sayı 3–4'e çıkmaktadır.</p>
<h2>Mevsime Göre Temizlik Takvimi</h2>
<h3>İlkbahar (Mart–Mayıs): En Kritik Temizlik</h3>
<p>Kış boyunca biriken toz, is ve çamur kalıntıları güneşlerin uzadığı ilkbaharda panellerin üzerinde yoğun bir tabaka oluşturur. Aynı dönemde tarım ilaçlamaları ve çiçek poleni de panellere yapışır. Mevsimlik en önemli temizlik budur; zira yıllık üretimin önemli bir bölümü Nisan–Haziran arasında gerçekleşir.</p>
<h3>Yaz (Haziran–Ağustos): Sıcak Bölgeler için Ek Temizlik</h3>
<p>Ege, Akdeniz ve İç Anadolu'da yaz aylarındaki yüksek sıcaklıklar, kuruyan toprak tozunu panellere taşır. Tarımsal sulama ve hasat dönemi de kirlilik yükünü artırır. Büyük kapasiteli santraller için yaz ortasında ek bir temizlik hem üretimi hem de panel sağlığını korur.</p>
<h3>Sonbahar (Eylül–Kasım): Kış Öncesi Hazırlık</h3>
<p>Hasat sonrası saman tozu, yaprak ve nem birikimi sonbahar temizliğini zorunlu kılar. Kış yağışlarından önce yapılan bir temizlik, panellerin nem ve buz döngüsüne karşı daha dirençli olmasını sağlar. Aynı zamanda bu dönemde yapılan termal kamera taraması, kışa girerken hotspot'ların tespit edilmesini mümkün kılar.</p>
<h3>Kış (Aralık–Şubat): Kar ve Buzlanma Sonrası</h3>
<p>Kar ve buzun çökmesinin ardından panel yüzeylerinde kalıntılar oluşabilir. Kış güneşinin az olduğu bu dönemde üretim zaten düşük olsa da panel yüzeylerinin temiz tutulması, ilkbaharın ilk güneşli günlerinden tam kapasite yararlanılmasını sağlar.</p>
<h2>Soma ve Sanayi Bölgelerine Özel Durum</h2>
<p>Soma gibi termik santral ve maden ocaklarının yakınındaki GES sahalarında tablo farklıdır. Kömür tozu, silis ve is partiküllerinin birikmesi yüzünden bu bölgelerdeki paneller ulusal ortalamanın 1,5–2 katı hızla kirlenir. Bu durumdaki sahalar için yılda <strong>4–6 temizlik</strong> teknik ve ekonomik açıdan en verimli stratejidir.</p>
<h2>Temizlik Zamanını Belirleyen Sinyaller</h2>
<ul>
<li>İnvertör verisinde açıklanamayan üretim düşüşü (%5 ve üzeri)</li>
<li>Panel yüzeyinde gözle görülür kir, toz veya kuş pisliği birikimi</li>
<li>Bitişik panellerle karşılaştırıldığında tek bir dizide belirgin düşük üretim</li>
<li>Yoğun tarım ilacı uygulaması veya hasat dönemi sonrası</li>
<li>Uzun süreli kuru ve rüzgârlı hava döneminden çıkış</li>
</ul>
<h2>Sonuç</h2>
<p>Güneş paneli temizliği tek seferlik bir bakım değil, santralinizin verimini korumak için sürekli takip edilmesi gereken bir operasyondur. Doğru zamanda yapılan profesyonel temizlik, yıllık üretim kaybını en aza indirerek yatırım dönüşünüzü maksimuma çıkarır.</p>
<p>New Temizlik olarak santralinizin bölgesi ve kapasitesine göre özelleştirilmiş yıllık temizlik takvimi hazırlıyoruz. Ücretsiz saha değerlendirmesi için bize ulaşın.</p>
`.trim(),
  },
  {
    slug: 'ges-hotspot-nedir',
    title: "GES'te Hotspot (Sıcak Nokta) Nedir ve Nasıl Tespit Edilir?",
    excerpt: 'Hotspot neden oluşur, panel sağlığına ve güvenliğine ne gibi zararlar verir? Termal kamera ile erken tespitin önemi.',
    metaDescription: 'GES panellerinde hotspot (sıcak nokta) nedir, neden oluşur, ne gibi zararlara yol açar ve termal kamera ile nasıl tespit edilir? Kapsamlı teknik rehber.',
    coverImage: '/ges-bakim-onarim-termal-analiz.jpeg',
    sortOrder: 1,
    content: `
<p>Güneş enerji santrallerinin uzun vadeli sağlığını tehdit eden en ciddi sorunlardan biri <strong>hotspot</strong>, yani sıcak nokta oluşumudur. Çoğu zaman çıplak gözle fark edilemeyen bu sorun, fark edilmeden ilerlediğinde ciddi verim kayıplarına, panel hasarına ve hatta yangın riskine yol açabilir.</p>
<h2>Hotspot Nedir?</h2>
<p>Hotspot, bir güneş panelinin belirli bir bölgesinde — genellikle tek bir fotovoltaik hücre veya birkaç hücreden oluşan küçük bir alanda — aşırı ısı birikmesidir. Normal çalışan bir güneş panelinde tüm hücreler aynı miktarda elektrik üretirken, bir hotspot bölgesinde o hücreler enerji üretmek yerine enerji <em>tüketir</em> ve bu enerji ısıya dönüşür.</p>
<p>Bu bölgesel ısınma, etkilenen hücrenin sıcaklığının çevre hücrelerden 10–80°C daha yüksek olmasına neden olabilir. Termal kamera ile bakıldığında panelin üzerindeki parlak sıcak nokta hemen dikkat çeker.</p>
<h2>Hotspot Neden Oluşur?</h2>
<p>Birden fazla neden hotspot oluşumuna yol açabilir:</p>
<ul>
<li><strong>Kısmi gölgeleme:</strong> Bir kuş pisliği, yaprak ya da kirlilik tabakası panelin küçük bir bölgesini örttüğünde, o hücre grubunun akımı azalır ve dizi boyunca akan fazla akım ısıya dönüşür.</li>
<li><strong>Hasarlı hücreler:</strong> Üretim hatası, taşıma sırasında oluşan mikro çatlaklar veya dolu hasarı, hücrenin doğru çalışmasını engeller.</li>
<li><strong>Bağlantı sorunları:</strong> Devre dışı kalan bypass diyotları veya gevşeyen lehim bağlantıları, mevcut akımın alternatif yollardan geçmesine neden olur.</li>
<li><strong>Kirlilik birikimi:</strong> Özellikle kömür tozu veya kuş pisliği gibi iletken olmayan yoğun kir, belirli hücrelerde gölgeleme etkisi yaratır.</li>
</ul>
<h2>Hotspot'un Zararları</h2>
<p>Hotspot uzun süre tespit edilmeden bırakıldığında hasarlar giderek büyür:</p>
<ul>
<li><strong>Verim kaybı:</strong> Hotspot bulunan bir panel %10–30 daha az üretim yapabilir.</li>
<li><strong>Panel degradasyonu:</strong> Süregelen aşırı ısı, hücre içindeki kapsülleme maddesini sarartır ve yavaşça parçalar.</li>
<li><strong>Cam çatlağı:</strong> Termal genleşme ve büzülme döngüleri cam yüzeyde çatlak oluşturur, bu da suya karşı korumayı ortadan kaldırır.</li>
<li><strong>Yangın riski:</strong> 200°C'yi aşan sıcaklıklara ulaşabilen hotspot'lar çerçeveyi veya montaj yapısını tutuşturabilir.</li>
<li><strong>Komşu panel etkisi:</strong> Bir string'deki hasarlı panel, tüm dizi üretimini olumsuz etkiler.</li>
</ul>
<h2>Hotspot Nasıl Tespit Edilir?</h2>
<h3>Termal Kamera (İnfrared Tarama)</h3>
<p>Hotspot tespitinin altın standardı termal kamera analizidir. İnfrared kamera ile paneller tarandığında sıcak noktalar kırmızı/sarı renkte belirgin biçimde görünür. Bu yöntemde sahaya yakın değil, mesafeli tarama yapılabildiği için büyük santrallerde hızlı ve kapsamlı analiz mümkündür.</p>
<p>Taramanın en verimli sonucu vermesi için açık hava koşullarında (direkt güneş ışığı altında) ve paneller tam kapasitede çalışırken yapılması gerekir.</p>
<h3>İnvertör Verisi İzleme</h3>
<p>String bazında üretim verisini sürekli izleyen izleme sistemleri, belirgin performans düşüşlerini alarm olarak bildirir. Ancak bu yöntem hotspot'un tam konumunu değil, sorunlu bölgeyi işaret eder. Termal tarama ile birlikte kullanıldığında çok etkilidir.</p>
<h2>Hotspot Nasıl Önlenir?</h2>
<ul>
<li>Düzenli panel temizliği ile kirlilik kaynaklı gölgelemenin önüne geçilmesi</li>
<li>Yılda en az iki kez profesyonel termal kamera taraması yaptırılması</li>
<li>Gölge düşüren engellerin (ağaç, bina, tesisat) kontrol edilmesi</li>
<li>Bypass diyotlarının ve bağlantı noktalarının periyodik kontrolü</li>
<li>Dolu, fırtına veya hasar riski sonrası ivedi termal tarama</li>
</ul>
<h2>Sonuç</h2>
<p>Hotspot, çıplak gözle görülemeyen ama GES santralinizin uzun vadeli sağlığını ve güvenliğini doğrudan tehdit eden bir sorundur. Erken tespit ve müdahale hem panel ömrünü uzatır hem de yangın riskini ortadan kaldırır.</p>
<p>New Temizlik olarak düzenli bakım hizmetimizin bir parçası olarak termal kamera analizi sunuyor, hotspot tespiti ve giderilmesi konusunda tam kapsamlı destek sağlıyoruz.</p>
`.trim(),
  },
  {
    slug: 'kirli-gunes-paneli-verim-kaybi',
    title: 'Kirli Güneş Paneli Ne Kadar Verim Kaybettirir?',
    excerpt: "Araştırma verileri ve gerçek hesaplama örnekleriyle: 1 MW GES'te kirlilik yüzünden kaybedilen enerji ve para ne kadar?",
    metaDescription: "Kirli güneş paneli verim kayıpları, araştırma verileri ve gerçek hesaplama örnekleri. 1 MW GES'te kirlilik yüzünden kaybedilen TL'yi hesaplayın.",
    coverImage: '/ges-kir-problemleri.jpg',
    sortOrder: 2,
    content: `
<p>Güneş panellerinizin temiz görünmesi, yeterince temiz olduğu anlamına gelmez. Panel yüzeyine gözle fark edilmeyecek kadar ince bir toz tabakası bile güneş ışığının panele ulaşma oranını anlamlı ölçüde düşürür. Peki bu kaybın boyutu ne kadardır?</p>
<h2>Araştırmalar Ne Söylüyor?</h2>
<p>Uluslararası Yenilenebilir Enerji Ajansı (IRENA) ve çeşitli üniversitelerin yaptığı bağımsız çalışmalar, temizlenmeyen güneş panellerinin kirlilik düzeyine bağlı olarak <strong>%10 ile %35</strong> arasında verim kaybı yaşadığını ortaya koymaktadır.</p>
<p>Kirlilik türü bu kaybın büyüklüğünü doğrudan etkiler:</p>
<ul>
<li><strong>İnce toz tabakası:</strong> %5–10 kayıp. Görünmez ama sürekli birikerek katmana dönüşür.</li>
<li><strong>Tarımsal toz ve ot poleni:</strong> %10–20 kayıp. Yapışkan yapısı nedeniyle yağmurla temizlenmez.</li>
<li><strong>Kuş pisliği:</strong> %20–30 kayıp. Küçük bir alan kaplasa bile o bölgedeki hücre grubunu tamamen bloke eder.</li>
<li><strong>Sanayi/kömür tozu:</strong> %25–35 kayıp. Soma gibi endüstriyel bölgelerde is ve kömür tozunun camla kimyasal bağ kurması temizliği güçleştirir.</li>
</ul>
<h2>Rakamlarla: 1 MW GES'te Kayıp Ne Kadar?</h2>
<p>Somutlaştırmak için basit bir hesap yapalım. Türkiye'de yıllık ortalama güneş ışınımı verilerine göre 1 MW kurulu güce sahip bir GES yaklaşık <strong>1.400–1.600 MWh/yıl</strong> üretim yapabilir.</p>
<p>Güncel elektrik alım fiyatları baz alındığında bu üretim yılda yaklaşık <strong>2–3 milyon TL</strong> gelir anlamına gelmektedir.</p>
<p>Panellerin hiç temizlenmediği ve %20 verim kaybı yaşandığı varsayılırsa, bu 1 MW santral yılda <strong>400.000–600.000 TL değerinde üretim kaybeder</strong>. Yılda 2–3 kez yapılacak profesyonel temizliğin maliyetinin bu kayıpla kıyaslandığında yatırım geri dönüş süresi genellikle birkaç aydır.</p>
<h2>Soma Bölgesine Özel Durum</h2>
<p>Soma ve çevresindeki GES santralerinde tablo daha da kritiktir. Termik santrallerin egzoz gazları, kömür ocaklarının tozu ve tarım arazilerinden gelen tarımsal kirlilik iç içe geçtiğinde panel yüzeylerinde ulusal ortalamanın çok üzerinde bir kirlilik yükü birikir.</p>
<p>Sahada yapılan ölçümler, Soma bölgesindeki bazı santrallerde temizlenmeyen panellerin güneş ışığının yalnızca <strong>%65–70'ini</strong> alabildiğini ortaya koymaktadır. Bu, %30–35 düzeyinde bir verim kaybı demektir.</p>
<h2>"Yağmur Paneli Temizlemez mi?"</h2>
<p>Sık sorulan bir sorudur. Hafif yağmur, yalnızca gevşek toz partikülleri için kısmen etkilidir. Ancak yağmurla gelen su, panelinizin yüzeyinde kuruduğunda kendi içerdiği kireç ve mineralleri de bırakır — bu da yeni bir kirlilik katmanı oluşturur. Yapışkan tarımsal toz, kuş pisliği ve sanayi kirliliği ise yağmurla hiçbir şekilde temizlenmez.</p>
<h2>Temizliğin Gerçek Değeri</h2>
<p>Profesyonel GES temizliği bir maliyet kalemi değil, kâr hanesine yazılması gereken bir yatırımdır. New Temizlik olarak temizlik öncesi ve sonrası üretim verilerini karşılaştıran dijital raporlar sunuyoruz — bu sayede temizliğin santralinize kattığı değeri rakamlarla görebilirsiniz.</p>
`.trim(),
  },
  {
    slug: 'otonom-robot-mu-manuel-temizlik-mi',
    title: 'GES Temizliğinde Otonom Robot mu, Manuel Temizlik mi?',
    excerpt: 'İki yöntemin maliyet analizi, avantaj ve dezavantajları. Hangi saha büyüklüğünde hangisi daha kârlı?',
    metaDescription: 'GES panel temizliğinde otonom temizlik robotu ile manuel temizlik arasındaki farklar, maliyet analizi ve hangi saha büyüklüğü için hangisinin doğru seçim olduğu.',
    coverImage: '/soma-ges-otonom-temizlik-robotu.jpeg',
    sortOrder: 3,
    content: `
<p>Güneş enerji santralinizin temizlik ihtiyacını karşılamanın birden fazla yolu var: sahaya ekip göndermek ya da otonom bir temizlik robotu kullanmak. Doğru kararı vermek için saha büyüklüğü, temizlik sıklığı ve uzun vadeli maliyet hesabı birlikte değerlendirilmelidir.</p>
<h2>Manuel Temizlik Hizmeti</h2>
<p>Profesyonel bir ekip, saha koşullarını yerinde değerlendirerek uygun ekipman ve temizlik yöntemini seçer. Yumuşak fırça sistemleri ve deiyonize su kullanılarak panel yüzeyine zarar verilmeden etkili bir temizlik yapılır.</p>
<p><strong>Avantajları:</strong></p>
<ul>
<li>Düşük başlangıç yatırımı — robot alımı veya kurulum maliyeti yok</li>
<li>Sahaya özel yaklaşım — düzensiz topografya, karmaşık panel dizilimi sorun değil</li>
<li>Termal kamera, invertör kontrolü gibi bakım hizmetleriyle entegre yürütülebilir</li>
<li>Küçük ve orta ölçekli sahalar için maliyet-etkin</li>
</ul>
<p><strong>Dezavantajları:</strong></p>
<ul>
<li>Her temizlik için ekip programlama ve lojistik gerektiriyor</li>
<li>Büyük sahalar için temizlik süresi daha uzun</li>
<li>İnsan kaynağına bağımlılık</li>
</ul>
<h2>Otonom Temizlik Robotu</h2>
<p>Otonom GES temizlik robotları, sahaya monte edilen ray sistemleri üzerinde hareket ederek panelleri otomatik olarak temizler. IoT entegrasyonu ile uzaktan izleme ve kontrol mümkün olduğundan santral sahibi müdahale gerektirmeden temizlik işlemi gerçekleşir.</p>
<p><strong>Avantajları:</strong></p>
<ul>
<li>İşgücü maliyetini %60'a kadar azaltır — uzun vadede ciddi tasarruf</li>
<li>Daha sık temizlik yapılabilir, verim sürekliliği sağlanır</li>
<li>Uzaktan izleme ve programlanabilir çalışma takvimi</li>
<li>Büyük ölçekli (500 kWp ve üzeri) sahalar için giderek artan ROI</li>
<li>Tutarlı temizlik kalitesi — insan hatasına bağlı değişkenlik yok</li>
</ul>
<p><strong>Dezavantajları:</strong></p>
<ul>
<li>Yüksek başlangıç yatırımı (kurulum dahil)</li>
<li>Düzensiz topografya veya karmaşık dizilimlerde ray tasarımı zorlaşabilir</li>
<li>Periyodik teknik bakım ve yedek parça maliyeti</li>
<li>Küçük sahalar için geri dönüş süresi uzun</li>
</ul>
<h2>Hangi Seçenek Sizin için Doğru?</h2>
<p>İki yöntemi karşılaştırırken tek bir metrik yeterli değildir. Saha büyüklüğü, temizlik sıklığı hedefi, arazi yapısı ve bütçe birlikte değerlendirilmelidir:</p>
<ul>
<li><strong>Saha büyüklüğü</strong> — Manuel: her büyüklük · Otonom robot: 500 kWp+</li>
<li><strong>Başlangıç maliyeti</strong> — Manuel: düşük · Otonom robot: yüksek</li>
<li><strong>İşletme maliyeti</strong> — Manuel: orta · Otonom robot: düşük</li>
<li><strong>Temizlik sıklığı</strong> — Manuel: programlı · Otonom robot: istediğinde</li>
<li><strong>Uzun vadeli ROI</strong> — Manuel: orta · Otonom robot: yüksek</li>
</ul>
<p><strong>500 kWp altındaki sahalar</strong> için periyodik profesyonel temizlik hizmetleri genellikle daha ekonomik ve pratiktir. <strong>500 kWp ve üzeri sahalar</strong> içinse otonom robot yatırımı, uzun vadede ciddi maliyet avantajı sağlar; özellikle yılda 4 veya daha fazla temizlik planlandığında geri dönüş süresi hızla kısalır.</p>
<h2>İki Yaklaşımı Birleştiren Strateji</h2>
<p>Bazı büyük GES işletmecileri her iki yaklaşımı birlikte kullanır: otonom robot rutin temizliği yürütürken, termal analiz ve bakım kontrolleri için uzman ekip periyodik olarak sahayı ziyaret eder. Bu karma model, hem operasyonel verimliliği hem de santral sağlığını en üst düzeyde korur.</p>
<p>New Temizlik olarak hem profesyonel manuel temizlik hizmetleri hem de otonom temizlik robotu satışı ve kurulumu konusunda çözüm sunuyoruz. Santralinize özel en uygun stratejiyi birlikte belirleyelim.</p>
`.trim(),
  },
]

// scope: 'genel' anasayfa + /sss; diğer üçü ilgili hizmet sayfasının FAQPage'ini besler
const FAQS: Array<{ scope: 'genel' | 'panel-temizlik' | 'panel-bakim' | 'robot-satisi'; question: string; answer: string; sortOrder: number }> = [
  {
    scope: 'genel', sortOrder: 0,
    question: 'Hangi bölgelere hizmet veriyorsunuz?',
    answer: 'Soma/Manisa merkezli olmak üzere tüm Türkiye genelinde GES temizlik ve bakım hizmeti sunmaktayız.',
  },
  {
    scope: 'genel', sortOrder: 1,
    question: 'Güneş paneli temizliği ne sıklıkla yapılmalıdır?',
    answer: 'Bulunduğunuz bölgenin toz, polen ve çevre kirliliği durumuna göre değişmekle birlikte, panellerin maksimum verimde çalışması için yılda en az 2 kez (tercihen ilkbahar ve sonbahar aylarında) profesyonel temizlik önerilmektedir.',
  },
  {
    scope: 'genel', sortOrder: 2,
    question: 'Temizlikte kullandığınız ürünler ve ekipmanlar nelerdir?',
    answer: 'Tüm temizlik süreçlerimizde yüzeye zarar vermeyen, doğa dostu özel solüsyonlar ve son teknoloji ekipmanlar kullanıyoruz. Su israfı yapmadan, minimum su tüketimiyle maksimum temizlik sağlıyoruz.',
  },
  {
    scope: 'genel', sortOrder: 3,
    question: 'Hizmetleriniz garantili mi?',
    answer: 'Evet, tüm panel temizliği, periyodik bakım ve sunduğumuz diğer endüstriyel çözümler firmamızın garantisi altındadır. Memnuniyetiniz bizim için önceliktir.',
  },
  {
    scope: 'genel', sortOrder: 4,
    question: 'Fiyatlandırma nasıl yapılıyor?',
    answer: 'Fiyatlandırmamız panel sayısı, çatı veya arazinin durumu, kirlilik derecesi ve periyodik anlaşma gibi faktörlere bağlı olarak değişiklik göstermektedir. Detaylı ve adil bir fiyat teklifi için ücretsiz keşif talep edebilirsiniz.',
  },
  {
    scope: 'panel-temizlik', sortOrder: 0,
    question: "Soma'da GES temizliği hizmeti veriyor musunuz?",
    answer: "Evet, New Temizlik olarak Soma merkezli faaliyet gösteriyor ve Soma ile çevresindeki tüm GES sahalarına hizmet veriyoruz. Soma'nın termik santral ve sanayi bölgelerine yakınlığı nedeniyle bölgedeki güneş panelleri ülke ortalamasının çok üzerinde kirlenme yaşamaktadır. Bu özel koşullar için geliştirdiğimiz ekipman ve yöntemlerle sahada çözüm üretiyoruz.",
  },
  {
    scope: 'panel-temizlik', sortOrder: 1,
    question: 'Türkiye genelinde GES panel temizliği yapıyor musunuz?',
    answer: 'Evet, New Temizlik olarak Soma ve Manisa merkez olmak üzere İzmir, Balıkesir, Kütahya, Uşak, Afyon, Konya, Ankara, Antalya ve Adana dahil Türkiye genelindeki GES sahalarına hizmet vermekteyiz. Büyük kapasiteli santraller için saha keşfi yaparak özel hizmet planı oluşturuyoruz.',
  },
  {
    scope: 'panel-temizlik', sortOrder: 2,
    question: 'Güneş panelleri ne sıklıkla temizlenmeli?',
    answer: 'GES santrallerinde panel temizliği, bölgenin iklim koşullarına ve çevresel kirlilik düzeyine göre değişmekle birlikte genellikle yılda 2–4 kez önerilmektedir. Soma gibi sanayi ve kömür tozu yoğunluğu yüksek bölgelerde mevsim geçişlerinde yapılan temizlikler verim artışını maksimuma çıkarır.',
  },
  {
    scope: 'panel-temizlik', sortOrder: 3,
    question: 'Kirli güneş paneli ne kadar verim kaybına yol açar?',
    answer: 'Araştırmalar, temizlenmemiş güneş panellerinin toz, kir ve kuş pisliği birikimi nedeniyle %15 ile %30 arasında verim kaybına uğradığını göstermektedir. Soma gibi endüstriyel bölgelerin yakınındaki GES sahalarında bu kayıp daha da yüksek olabilmektedir.',
  },
  {
    scope: 'panel-temizlik', sortOrder: 4,
    question: 'Panel temizliği sırasında sistem kapatılmalı mı?',
    answer: 'Güvenli bir GES panel temizliği için sistem DC tarafı itibarıyla devre dışı bırakılmalıdır. New Temizlik ekiplerimiz ISG standartlarına uygun olarak tüm güvenlik protokollerini eksiksiz uygular; sistem kapatma ve açma işlemleri de hizmet kapsamına dahildir.',
  },
  {
    scope: 'panel-temizlik', sortOrder: 5,
    question: 'Hangi temizlik yöntemini kullanıyorsunuz?',
    answer: 'Panel yüzeyine zarar vermemek için yumuşak fırça sistemleri ve kontrollü saf su kullanıyoruz. Kimyasal kullanmıyor, yüksek basınçlı su ile panel yüzeyini aşındırmıyoruz. Temizlik sonrası leke bırakmayan deiyonize su tercih edilmektedir.',
  },
  {
    scope: 'panel-bakim', sortOrder: 0,
    question: 'GES bakımı ne zaman yapılmalı?',
    answer: 'Güneş enerji santrallerinde bakım, yılda en az iki kez — ilkbahar ve sonbahar dönemlerinde — yapılmalıdır. Üretim verilerinde ani düşüşler veya invertör alarmları yaşandığında ise beklemeden teknik müdahale talep edilmelidir. New Temizlik olarak yıllık bakım sözleşmesi kapsamında düzenli periyodik kontrol sağlıyoruz.',
  },
  {
    scope: 'panel-bakim', sortOrder: 1,
    question: "Hotspot nedir ve GES'e zararı nedir?",
    answer: "Hotspot (sıcak nokta), bir güneş panelinde hasarlı veya gölgeli hücrenin aşırı ısınmasıyla oluşan bölgesel sıcaklık yükselmesidir. Tespit edilmezse panel kalıcı olarak hasar görür, yangın riski oluşabilir ve komşu paneller de etkilenebilir. Termal kamera analizi ile hotspot'lar gözle görülmeden erken aşamada belirlenir.",
  },
  {
    scope: 'panel-bakim', sortOrder: 2,
    question: 'Yıllık bakım sözleşmesi neleri kapsar?',
    answer: "New Temizlik'in yıllık GES bakım sözleşmesi; periyodik performans izleme, invertör ve DC kablo hat kontrolleri, sigorta ve montaj noktası denetimleri, termal kamera analizi, dijital raporlama ve arıza durumlarında öncelikli müdahale garantisini kapsamaktadır.",
  },
  {
    scope: 'panel-bakim', sortOrder: 3,
    question: 'GES bakımı yapılmazsa ne olur?',
    answer: 'Düzenli bakım yapılmayan GES santrallerinde invertör arızaları, panel degradasyonu, bağlantı noktalarında korozyon ve hotspot kaynaklı yangın riskleri ortaya çıkabilir. Proaktif bakımla bu sorunların büyük çoğunluğu ortaya çıkmadan önlenir, santralin ömrü uzar.',
  },
  {
    scope: 'robot-satisi', sortOrder: 0,
    question: 'Solar panel temizlik robotu hangi saha büyüklükleri için uygundur?',
    answer: 'Otonom GES temizlik robotlarımız özellikle 500 kWp ve üzeri büyük ölçekli güneş enerji santrallerine yönelik tasarlanmıştır. Saha geometrisine ve panel dizilimine göre ray sistemi özelleştirilebildiğinden farklı topolojilerdeki sahalar için çözüm sunulmaktadır.',
  },
  {
    scope: 'robot-satisi', sortOrder: 1,
    question: 'GES temizlik robotu kurulumu nasıl yapılır?',
    answer: 'Kurulum süreci; saha ölçümü ve ray sistemi tasarımı, ekipman montajı ve saha testi, operatör eğitimi ve sisteme bağlantı adımlarından oluşmaktadır. New Temizlik teknik ekibi tüm kurulum sürecini yerinde yürütür ve 2 yıl teknik destek garantisi sağlar.',
  },
  {
    scope: 'robot-satisi', sortOrder: 2,
    question: 'Robot mu yoksa manuel temizlik hizmeti mi tercih etmeliyim?',
    answer: "500 kWp altındaki sahalar için periyodik profesyonel temizlik hizmeti genellikle daha ekonomiktir. Ancak büyük ölçekli sahalar için otonom robot, işgücü maliyetini %60'a kadar azaltır ve daha sık temizlik yapılmasına imkân tanıyarak yıllık üretimi artırır.",
  },
  {
    scope: 'robot-satisi', sortOrder: 3,
    question: 'Temizlik makinaları satın almak için nasıl teklif alabilirim?',
    answer: 'Saha büyüklüğünüzü ve panel tipinizi bildirerek 0530 473 87 93 numaralı telefondan ya da WhatsApp üzerinden bizimle iletişime geçebilirsiniz. Santralinize özel ürün ve fiyat teklifi hazırlıyoruz.',
  },
]

// scale: eski sitedeki 1.3/1.4 çarpanları korunuyor, diğerleri varsayılan 1
const REFERENCES = [
  { name: 'Albayrak', logo: '/albayrak.png', scale: 1, sortOrder: 0 },
  { name: 'Bizim Yem', logo: '/bizimyem.png', scale: 1.4, sortOrder: 1 },
  { name: 'Gezgin Enerji', logo: '/gezginenerji.png', scale: 1.4, sortOrder: 2 },
  { name: 'Halkbank', logo: '/halkbank.png', scale: 1, sortOrder: 3 },
  { name: 'La Bella', logo: '/labella.png', scale: 1, sortOrder: 4 },
  { name: 'Mert Civata', logo: '/mert-civata-logo.png', scale: 1, sortOrder: 5 },
  { name: 'Saloni', logo: '/saloni.png', scale: 1, sortOrder: 6 },
  { name: 'Sun Tekstil', logo: '/suntekstil.png', scale: 1, sortOrder: 7 },
  { name: 'Wolfex', logo: '/wolfex.png', scale: 1, sortOrder: 8 },
  { name: 'Hasan Atak', logo: '/hasanatak.webp', scale: 1, sortOrder: 9 },
  { name: 'Renel Enerji', logo: '/renel-enerji.png', scale: 1.3, sortOrder: 10 },
  { name: 'Ege Linyitleri İşletmesi Müdürlüğü', logo: '/ege-linyitleri-isletmesi-mudurlugu.png', scale: 1, sortOrder: 11 },
  // Eski dosya adı "kirkagac-alay-komutanlıgi.png" (Türkçe ı) — Faz 6'da asset
  // taşınırken ASCII'ye çevrilecek, buradaki isim o hedefi işaret ediyor
  { name: 'Kırkağaç Alay Komutanlığı', logo: '/kirkagac-alay-komutanligi.png', scale: 1, sortOrder: 12 },
]

async function seedBlog(): Promise<void> {
  const repo = ds.getRepository(BlogPost)
  const existing = await repo.count()
  if (existing > 0) {
    console.log(`blog_posts'ta zaten ${existing} kayıt var. Blog seed atlanıyor.`)
    return
  }
  for (const data of BLOG_POSTS) {
    const saved = await repo.save(repo.create({ ...data, published: true, publishedAt: PUBLISHED_AT }))
    console.log(`✓ blog: ${saved.title}`)
  }
}

async function seedFaqs(): Promise<void> {
  const repo = ds.getRepository(Faq)
  const existing = await repo.count()
  if (existing > 0) {
    console.log(`faqs'ta zaten ${existing} kayıt var. S.S.S. seed atlanıyor.`)
    return
  }
  for (const data of FAQS) {
    const saved = await repo.save(repo.create({ ...data, published: true }))
    console.log(`✓ faq (${saved.scope}): ${saved.question}`)
  }
}

async function seedReferences(): Promise<void> {
  const repo = ds.getRepository(Reference)
  const existing = await repo.count()
  if (existing > 0) {
    console.log(`references'ta zaten ${existing} kayıt var. Referans seed atlanıyor.`)
    return
  }
  for (const data of REFERENCES) {
    const saved = await repo.save(repo.create({ ...data, published: true }))
    console.log(`✓ referans: ${saved.name}`)
  }
}

async function seed(): Promise<void> {
  await ds.initialize()
  console.log('DB bağlandı')

  await seedBlog()
  await seedFaqs()
  await seedReferences()

  console.log('Seed tamamlandı! Kapak görselleri ve logolar admin panelden de güncellenebilir.')
  await ds.destroy()
}

seed().catch((err) => {
  console.error('Seed hatası:', err)
  process.exit(1)
})
