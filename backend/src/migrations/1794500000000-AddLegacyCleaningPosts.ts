import { MigrationInterface, QueryRunner } from "typeorm";

// Eski newtemizlik.com.tr'deki iki blog yazısı (/blog/11 ve /blog/12) yeni bloga
// genişletilerek taşınıyor. Slug'lar eski adreslerle aynı; frontend/lib/redirects.mjs
// eski /blog/<id>/<slug> adreslerini buraya 301 ile gönderir.
// Yalnızca kullanıcı onaylı hizmet iddiaları kullanıldı (P7 G1/G2 listeleri).
// Aynı slug zaten varsa (admin panelden elle eklenmişse) dokunulmaz.

const POSTS = [
  {
    slug: 'somada-ev-temizligi-profesyonel-hizmetin-farki',
    title: "Soma'da Ev Temizliği: Profesyonel Hizmetin Farkı Nerede Başlar?",
    excerpt:
      "Evi kendiniz mi temizlemelisiniz, yoksa bir ekip mi çağırmalısınız? Hangi işlerin uzmana bırakılmaya değdiğini, temizlik gününe nasıl hazırlanacağınızı ve firma seçerken neye bakmanız gerektiğini anlattık.",
    metaDescription:
      "Soma'da ev temizliği için profesyonel destek ne zaman mantıklı? Uzmana bırakılacak işler, temizlik gününe hazırlık ve firma seçerken sorulacak sorular.",
    coverImage: '/gorseller/ev-temizligi.webp',
    content: `<p>Çoğu evde temizlik aslında yapılıyor: haftada bir süpürülüyor, mutfak her akşam toparlanıyor, banyo siliniyor. Sorun, günlük temizliğin hiç ulaşmadığı yerlerde başlıyor. Ocağın arkası, banyo derzleri, pencere rayları, dolap üstleri ve balkon köşeleri aylarca sırada bekliyor. Bir gün hepsini birden yapmaya kalktığınızda bir hafta sonu yetmiyor.</p>
<p>Profesyonel ev temizliğinin farkı, evinizi sizden daha iyi tanımak değil. Fark; bu birikmiş işleri tek günde, doğru sırayla ve doğru ürünle bitirebilmekte. Bu yazıda Soma'da ev temizliği için ne zaman destek almanın mantıklı olduğunu, hangi işlerin uzmana bırakılmaya değdiğini ve temizlik gününe nasıl hazırlanabileceğinizi anlatıyoruz.</p>
<h2>Kendi Temizliğiniz ile Profesyonel Temizlik Arasındaki Fark</h2>
<p>Evde yapılan temizlik genellikle görünen yüzeylere odaklanır, çünkü vakit kısıtlıdır. Profesyonel bir ekip ise işi bir plana göre yapar. Önce üst raflar ve kapı üstleri, sonra mobilya yüzeyleri, en son zeminler temizlenir. Toz aşağı indiği için bu sıra, temizlenen yerin yeniden kirlenmesini önler. Basit görünür ama evde çoğu zaman tersi yapılır: önce yer silinir, sonra raflar silinir ve toz yeniden yere iner.</p>
<p>İkinci fark zamandır. Mutfaktaki yağ ve banyodaki kireç birkaç dakikada çıkmaz; ürünün yüzeyde beklemesi gerekir. Evde bu bekleme süresine sabır kalmaz, sert sünger devreye girer ve yüzey çizilir. Ekip ise bu süreyi plana koyar ve o sırada başka bir odada çalışır.</p>
<p>Üçüncü fark ayrımdır. Mutfakta ve banyoda kullanılan bezler birbirine ve odalara karışmamalıdır. Evde tek bir bezle her yeri silmek alışkanlık haline gelebilir. Profesyonel temizlikte bu ayrım işin parçasıdır.</p>
<h2>Hangi İşleri Uzmana Bırakmaya Değer?</h2>
<p>Her işi dışarıdan yaptırmak gerekmez. Günlük toparlama ve haftalık süpürme çoğu ev için yeterlidir. Ancak bazı işler, hem zaman hem de sonuç açısından bir ekibe bırakıldığında daha mantıklı hale gelir:</p>
<ul>
<li><strong>Mutfakta biriken yağ:</strong> Ocak çevresi, davlumbaz ve dolap üstündeki yapışkan tabaka.</li>
<li><strong>Banyo derzleri ve kireç:</strong> Derzlerde başlayan kararma günlük silmeyle açılmaz.</li>
<li><strong>Cam ve pencere rayları:</strong> Raylarda biriken toz yağmurla çamura döner ve sürgülü pencerenin rahat açılmasını engeller.</li>
<li><strong>Dolap içleri, fırın ve buzdolabı içi:</strong> Taşınma öncesinde ve sonrasında özellikle önemlidir.</li>
<li><strong>Balkon:</strong> Zemin, korkuluklar ve balkon camları.</li>
</ul>
<h2>Soma'da Ev Temizliğini Zorlaştıran Şey: Toz</h2>
<p>Termik santrale ve maden sahalarına yakın mahallelerde oturanlar, pencere kenarında ve balkonda biriken koyu tozu iyi bilir. Bu toz sıradan ev tozundan daha çabuk birikir ve camlarda, raylarda, balkon zemininde kendini hemen belli eder. Bu yüzden Soma'da cam ve balkon temizliğini mevsimde bir kez planlamak iyi bir ölçüdür. Rayları da her seferinde temizlemek gerekir.</p>
<p>Kapalı kalmış evler de ayrı bir konudur. Kış boyunca kullanılmayan bir ev ya da tatil dönüşü açılan bir daire, eşyalar kullanılmadan önce tozdan ve kokudan arındırılmalıdır.</p>
<h2>Temizlik Gününe Nasıl Hazırlanmalısınız?</h2>
<p>Profesyonel bir ekip çağırdığınızda sizin yapmanız gereken iş azdır, ama birkaç küçük hazırlık hem işi hızlandırır hem de içinizi rahatlatır:</p>
<ul>
<li><strong>Kişisel eşyaları kaldırın.</strong> Takı, belge ve ilaç gibi eşyaları önceden kaldırmanız yüzeylere ulaşmayı da kolaylaştırır.</li>
<li><strong>Hassas yüzeyleri söyleyin.</strong> Mermer tezgâh asitli üründen, parlak dolap kapağı sert süngerden, parke fazla sudan zarar görebilir.</li>
<li><strong>Evdeki özel durumları iletin.</strong> Bebek, astım veya alerjisi olan biri ya da evcil hayvan varsa havalandırma ve çalışma sırası buna göre planlanır.</li>
<li><strong>Önceliğinizi belirleyin.</strong> Sizin için en önemli oda hangisiyse ekip oradan başlayabilir.</li>
</ul>
<h2>Ev Temizliği Firması Seçerken Sorulacak Sorular</h2>
<p>Soma'da ev temizliği için bir firmayla görüşürken fiyattan önce şu soruların cevabını almak, gün sonunda yaşanacak sürprizleri önler:</p>
<ol>
<li><strong>Kapsamda neler var?</strong> Dolap içi, fırın ve buzdolabı içi dahil mi, yoksa ek iş mi?</li>
<li><strong>Malzemeyi kim getiriyor?</strong> Ekibin kendi malzemesi ve ekipmanıyla gelmesi, sizin ürün almanıza gerek bırakmaz.</li>
<li><strong>Teklif nasıl hazırlanıyor?</strong> Oda ve banyo sayısı, yaklaşık metrekare ve birkaç fotoğraf çoğu zaman teklif için yeterlidir.</li>
<li><strong>İş bitince kontrol ediliyor mu?</strong> Evin birlikte gezilmesi ve gözden kaçan noktanın o anda tamamlanması iyi bir işarettir.</li>
<li><strong>Düzenli temizlik yapılıyor mu?</strong> İlk temizlik birikmiş kiri aldığı için uzun sürer, sonrakiler o hali korur.</li>
</ol>
<h2>Tek Seferlik mi, Düzenli mi?</h2>
<p>Yılda iki kez, genellikle ilkbahar ve sonbaharda yapılan kapsamlı bir temizlik çoğu aile için yeterlidir. Yoğun çalışan, küçük çocuklu ya da büyüklerine destek olmak isteyen aileler için ise düzenli temizlik daha rahat bir çözüm olabilir. Düzenli çalışmayı düşünüyorsanız bunu ilk görüşmede söylemeniz, planın ve teklifin baştan doğru kurulmasını sağlar.</p>
<h2>New Temizlik ile Soma'da Ev Temizliği</h2>
<p>New Temizlik olarak Soma merkezde ve Kırkağaç, Akhisar başta olmak üzere Manisa'nın diğer ilçelerinde ev temizliği yapıyoruz. Malzeme ve ekipman bizden gelir. Kapsamı iş başlamadan konuşuruz, iş bitince evi sizinle birlikte kontrol ederiz. Ayrıntılar için <a href="/hizmetlerimiz/ev-temizligi">ev temizliği sayfamıza</a> göz atabilir, evinizin bilgilerini paylaşarak <a href="/iletisim">teklif alabilirsiniz</a>.</p>`,
  },
  {
    slug: 'soma-is-yeri-temizliginde-profesyonellik-neden-onemli',
    title: 'Soma İş Yeri Temizliğinde Profesyonellik Neden Önemli?',
    excerpt:
      'Ortak alanlar kimsenin işi olmadığında temizlik çalışanların omzuna kalır. İş yeri temizliğini profesyonel bir programa bağlamanın faydalarını ve bir firmayla anlaşırken netleştirmeniz gerekenleri anlattık.',
    metaDescription:
      "Soma'da iş yeri temizliğini neden profesyonel bir programa bağlamalı? Ortak alanlar, temizlik sıklığı, mesai düzeni ve firmayla netleştirilmesi gerekenler.",
    coverImage: '/gorseller/ofis-is-yeri-temizligi.webp',
    content: `<p>Bir iş yerinde temizlik çoğu zaman kimsenin asıl işi değildir. Herkes kendi masasını bir ölçüde toparlar, ama tuvalet, çay ocağı, toplantı odası ve giriş kimsenin sorumluluğunda olmaz. Bir süre sonra tuvaletten koku gelir, lavabo kirlenir, giriş paspası çamura döner. Gelen müşteri de bunu ilk bakışta fark eder.</p>
<p>Soma'da iş yeri temizliğinde profesyonelliğin anlamı tam olarak budur: ortak alanların temizliğini çalışanlarınızın üzerinden almak ve bunu iş yerinizin ritmine uygun bir programa bağlamak. Bu yazıda profesyonel temizliğin iş yerine neler kattığını ve bir firmayla anlaşırken nelere dikkat etmeniz gerektiğini anlatıyoruz.</p>
<h2>Temizlik Çalışanlarınızın İşi Olmamalı</h2>
<p>Küçük işletmelerde temizliğin çalışanlar arasında paylaştırılması sık görülür. İlk bakışta tasarruf gibi görünür, ama bedeli başka yerden ödenir: çalışanın asıl işine ayırdığı zaman azalır, temizlik yapılan güne göre değişir ve kimse işi tam olarak sahiplenmez. Ortak alanların temizliği ise tam da bu yüzden sürekli ertelenir.</p>
<p>Temizliği dışarıdan bir ekibe bıraktığınızda bu yük ortadan kalkar. Temizlik, çalışanlarınızın arasına değil, sizin belirlediğiniz bir zaman dilimine girer. Akşam mesai bitiminden sonra, sabah açılıştan önce ya da öğle arasında: hangisi işinizi en az etkiliyorsa program oraya yerleştirilir.</p>
<h2>İlk İzlenim Kapıdan Başlar</h2>
<p>Müşteri kabul eden iş yerlerinde temizlik doğrudan işin parçasıdır. Acente, galeri, eğitim kurumu veya mağaza fark etmez; gelen kişi ilk olarak girişi, bekleme alanını ve tuvaleti görür. Bina tozlu bir bölgedeyse ya da dışarıdan sık müşteri geliyorsa giriş alanının daha sık temizlenmesi gerekir, çünkü kir içeriye buradan yayılır.</p>
<p>Soma gibi madencilik ve enerji tesislerine yakın bir ilçede bu konu daha da önemlidir. Üretim veya depo alanının tozu ofis bölümüne kolayca taşınır, bu da daha sık temizlik gerektirir.</p>
<h2>Profesyonel Bir Programda Neler Olur?</h2>
<p>Düzenli bir iş yeri temizliği, her gün yapılması gereken işler ile daha seyrek yapılabilecek işleri birbirinden ayırır. Böylece gereksiz ziyaret için ödeme yapmazsınız. Tipik bir programda şunlar bulunur:</p>
<ul>
<li><strong>Her ziyarette:</strong> Çöplerin toplanması, tuvaletlerde temizlik ve dezenfeksiyon, çay ocağında tezgâh ve lavabo.</li>
<li><strong>Sık dokunulan yüzeyler:</strong> Kapı kolu, elektrik düğmesi ve telefon.</li>
<li><strong>Haftada bir veya iki kez:</strong> Çalışma alanlarında zemin, halıfleksin vakumlanması, masa ve dolapların dış yüzeyleri.</li>
<li><strong>Ayda bir:</strong> Cam bölmelerdeki el izleri.</li>
<li><strong>İki ayda bir:</strong> Dolap üstleri, süpürgelikler, klima ızgaraları ve koltuk araları gibi günlük temizlikte atlanan yerler.</li>
</ul>
<h2>Güven: Evrak ve Ekipmana Dokunmadan Çalışmak</h2>
<p>Ofiste temizlik aynı zamanda bir güven meselesidir. Masadaki evrak, ekrandaki bilgi ve dolaptaki dosya temizlik ekibinin işi değildir. Profesyonel bir ekip bu sınırı baştan çizer. Masadaki kâğıtların yeri değiştirilmez, çekmece ve dolaplar açılmaz, çöp kutusu dışındaki hiçbir şey atılmaz. Bilgisayar ve yazıcı gibi elektronik ekipmanın içine müdahale edilmez. Cihazların dış yüzeyi yalnızca sizin onayınızla ve kuru bezle silinir.</p>
<p>Mesai dışında çalışılacaksa anahtar, alarm ve kapanış düzeni önceden konuşulur. Kimin ne zaman girip çıktığı sizin bilginiz dahilinde olur. Düzenli işlerde mümkün olduğunca aynı ekibin gelmesi de iş yerinizi ve kurallarınızı tanıyan kişilerle çalışmanızı sağlar.</p>
<h2>Bir Temizlik Firmasıyla Anlaşırken Netleştirmeniz Gerekenler</h2>
<ol>
<li><strong>Kapsam:</strong> Hangi alanların temizleneceği ve hangilerinin kapsam dışında kalacağı yazılı olarak belli olsun.</li>
<li><strong>Sıklık ve saat:</strong> Çalışan sayınıza ve müşteri trafiğinize göre haftada kaç ziyaret yapılacağı ve hangi saatte gelineceği.</li>
<li><strong>Malzeme:</strong> Temizlik malzemesini firmanın getirmesi, iş yerinizde ürün depolama ve takip yükünü ortadan kaldırır.</li>
<li><strong>Fatura:</strong> İş yeriniz adına fatura düzenlenip düzenlenmediği.</li>
<li><strong>Değişiklik:</strong> Çalışan sayınız veya kullanımınız değiştiğinde programın nasıl güncelleneceği.</li>
</ol>
<h2>Tek Seferlik Temizlik Gerektiğinde</h2>
<p>Her iş yeri düzenli bir program istemeyebilir. Yıl sonu, denetim öncesi, ofis taşınması ya da yeniden açılış gibi durumlarda tek seferlik kapsamlı bir temizlik yeterli olabilir. Sonrasında ihtiyaç doğarsa düzenli programa geçmek her zaman mümkündür.</p>
<h2>New Temizlik ile Soma'da İş Yeri Temizliği</h2>
<p>New Temizlik olarak Soma merkezde ve Kırkağaç, Akhisar başta olmak üzere Manisa'nın diğer ilçelerinde ofis ve iş yeri temizliği yapıyoruz. Malzemeyi biz getiriyor, iş yeriniz adına fatura düzenliyoruz. Programı mesainizi bölmeyecek şekilde kuruyoruz. Ayrıntılar için <a href="/hizmetlerimiz/ofis-is-yeri-temizligi">ofis ve iş yeri temizliği sayfamıza</a> bakabilir, iş yerinizin bilgilerini paylaşarak <a href="/iletisim">teklif alabilirsiniz</a>.</p>`,
  },
]

export class AddLegacyCleaningPosts1794500000000 implements MigrationInterface {
  name = 'AddLegacyCleaningPosts1794500000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [i, p] of POSTS.entries()) {
      await queryRunner.query(
        `INSERT INTO "blog_posts" ("title", "slug", "excerpt", "metaDescription", "content", "coverImage", "published", "publishedAt", "sortOrder")
         VALUES ($1, $2, $3, $4, $5, $6, true, now(), $7)
         ON CONFLICT ("slug") DO NOTHING`,
        [p.title, p.slug, p.excerpt, p.metaDescription, p.content, p.coverImage, 5 + i],
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "blog_posts" WHERE "slug" = ANY($1)`, [POSTS.map((p) => p.slug)])
  }
}
