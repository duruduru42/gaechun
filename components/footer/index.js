const Footer = () => {
  return (
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://www.gaechundragon.co.kr/"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            개천용 입시컨설팅
          </a>
        </p>
      </footer>
  );
};

export default Footer;
