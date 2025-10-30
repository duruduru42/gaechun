const CanSection = () => {
  return (
    <div className="bg-gray-50 h-auto">
      {/* 모바일 전용 */}
      <div className="block md:hidden px-6 pt-32 pb-32 text-2xl font-bold text-center text-black leading-relaxed tracking-tight space-y-2">
        <p>성공적인 <span className="text-orange-400">고른기회 전형</span><br/>
        입시 마무리<br/>
        <span className="text-orange-400">개천용 입시 컨설팅</span>과<br/>
        함께라면<br/>
        어렵지 않을 거에요</p>
      </div>

      {/* 데스크탑 전용 (기존 디자인 유지) */}
      <div className="hidden md:block text-4xl font-bold text-center text-black my-60 leading-relaxed tracking-tight">
        <p>
          성공적인 <span className="text-orange-400">고른기회 전형</span> 입시 마무리,
          <br />
          <span className="text-orange-400">개천용 입시 컨설팅</span>과 함께라면,
          <br />
          어렵지 않을 거에요.
        </p>
      </div>
    </div>
  );
};

export default CanSection;
