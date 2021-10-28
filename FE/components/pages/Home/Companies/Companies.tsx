const Logo = ({ src }: { src: string }) => (
  <div className="w-1/4 py-5 px-6 flex-center">
    <img className="object-contain max-h-[50px] max-w-[180px]" src={src} />
  </div>
);

const Companies = () => {
  return (
    <div className="w-full rounded-2xl py-16 mb-10 from-blue-100/40 to-blue-200/40 via-blue-100/10 bg-gradient-to-r company-background">
      <h3 className="text-xl text-darkblue font-semibold text-center mb-8">
        Leading companies trust Google Meet
      </h3>
      <div className="flex flex-wrap mx-10 justify-center items-center">
        <Logo src="https://lh3.googleusercontent.com/RSIzwnc3dyd4CYkE7QboQEb75IGjhFsUEI8xuczKfJReqLwKc0_7Zohjuse8G7y7ytG1IQ7HtbgxJMGWN9QaioHHP7VJxpjbmI1r=rwu-v1-w1400" />
        <Logo src="https://lh3.googleusercontent.com/E0BghmxAkAvD7Xene11oMnHdEHAn_rSf_YSTTwOCoHtmB6AVJ7bb_a7PJWj1HvezC8hWKL8i5LHaO32WPlhNmA45Sr9kjV-tuYrCpA=rwu-v1-w1400" />
        <Logo src="https://lh3.googleusercontent.com/M8cUHrwDUCA_LxfddbMdIe7l5OXwqyCdVcss7kMLZlQ3N71gJdrOd2UUKEsXTK7GtNUso7zDRXhgcYvK6ZPJQSPwnHb2DO3x2cZCcNQ=rwu-v1-w1400" />
        <Logo src="https://lh3.googleusercontent.com/oJUH5qmnanOJAF_0y8zeoOl7iqCskhGgM8eVlgvzf8qwlj0LddKJ0_ysQMSGgfMmTY7j7CswPrET73OUNOStsaK1Cu9e345KovpdGA=rwu-v1-w1400" />
        <Logo src="https://lh3.googleusercontent.com/uvgcezV6Xgh4hpTOluzJhGEwa4DBKyv-6ICP6cI3wB9HlQuApL_rJIOfdjQPyX64YP_bQQcYYAcTrxG_Zfh34_VMFy73ntzuQXPY-KaCDSKojIUMVw=rwu-v1-w1400" />
        <Logo src="https://lh3.googleusercontent.com/g4ej_1rVDzB5uUpE9zY1wU4-HhSbCdGKsFjmhczNF5OgEPZeReScojWzekLrONsKLdimlCG8iiZEg2fI4RroBgvi8DsmmdU4yI-d=rwu-v1-w1400" />
        <Logo src="https://lh3.googleusercontent.com/8fLxReDDv-3EgxMBO_udPNTVS7YBv8xphW1NE1u78MUEklVQRpmiURhJGidEaB33hpox8gcQ1g3AsNZlZYeQvLXJCGKSJOr1VizR=rwu-v1-w1400" />
        <Logo src="https://lh3.googleusercontent.com/rzIyUxLW8vrt0DlNqdamNO40YXFCr9eThG6hyHS0j6eeo1LZWP9T5DuWd9_AdjT1Wpf5AGpgAMYoC8QAHnR5PNKe3PPP5olbmuNiTw=rwu-v1-w1400" />
      </div>
    </div>
  );
};

export default Companies;
