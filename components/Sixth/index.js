import Image from 'next/image'
import check from '@/components/ckmark.svg'
import gaechun from '@/components/gaechun.svg'

const includedFeatures = [
  '실제 성적표 인증 기반 성적입력 1회',
  '총 1130개 모집단위 분석 결과 제공',
  '군별로 3순위까지 저장, 수정권한 3회',
  '10개 이상 원서 영역 동영상 제공',
]

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">개천용 정시 합격예측 비용</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            수능 성적표 기반 성적입력, 합격예측 분석결과, 모의지원, 원서영역 인강 등 <br/>
            개천용 합격 예측의 모든 서비스를 이용하는 비용 <span className='text-orange-500 font-bold'>89,000원</span>
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
    <div className="p-8 sm:p-10 lg:flex-auto">
        <div className="flex flex-col items-start"> {/* Adjusted for vertical layout with left alignment */}
            <Image src={gaechun} alt="logo" className="mb-4" width={100} /> {/* Removed unnecessary classes */}
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">2026학년도 고른기회 전형 개천용 정시 합격예측</h3>
            </div>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-orange-500">포함된 서비스</h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3 font-bold">
                  <Image src={check} alt="체크" aria-hidden="true" className="h-6 w-5 flex-none " />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">한 번 결제로, 수능 접수 시까지 </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">₩ 89,000</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">원</span>
                </p>
                <a
                  href="/checkout"
                   className="mt-10 block w-full rounded-md bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  지금 시작하기
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
