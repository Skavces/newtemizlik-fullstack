// Marka renkleriyle dönen halka + logo — sayfa geçişlerinde kullanılan
// yükleme göstergesi. overlay: tam ekranı kaplayan beyaz perde olarak
// gösterir. Bu perde hiç unmount edilmez (bkz. usePageTransitionOverlay
// kullanan PageTransitionOverlay) — görünürlüğü `show` prop'una göre
// opacity transition'ıyla kontrol edilir. Art arda hızlı gelen
// navigasyonlarda overlay tam kapanıp yeniden mount olsaydı, arada gerçek
// içeriğin bir kare görünüp ardından animasyonun sıfırdan tekrar başladığı
// bir "flaş" oluşuyordu — sürekli mount edip sadece opacity'yi değiştirmek
// bu boşluğu ortadan kaldırıyor.
import Image from 'next/image'

type PageLoaderProps = {
  label?: string
  fullScreen?: boolean
  overlay?: boolean
  show?: boolean
}

export default function PageLoader({ label = '', fullScreen = false, overlay = false, show = true }: PageLoaderProps) {
  const ringSize = fullScreen ? 'w-24 h-24' : 'w-14 h-14'
  const logoSize = fullScreen ? 'w-28 h-28' : 'w-9 h-9'
  const logoPx = fullScreen ? 112 : 36

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-5 ${fullScreen ? 'min-h-screen' : 'py-24'}`}>
      <div className={`brand-loader-ring ${ringSize} rounded-full p-[3px]`}>
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <Image
            src="/newtemizliklogo.svg"
            alt=""
            width={logoPx}
            height={logoPx}
            className={logoSize}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      {label && <p className={`text-gray-400 ${fullScreen ? 'text-base' : 'text-sm'}`}>{label}</p>}
    </div>
  )

  if (!overlay) return spinner

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-center justify-center pointer-events-none transition-opacity duration-200 ease-out ${show ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden={!show}
    >
      {spinner}
    </div>
  )
}
