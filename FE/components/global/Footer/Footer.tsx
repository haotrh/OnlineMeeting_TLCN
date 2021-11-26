import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="bg-[#10182F] py-8 px-32 text-[#7681A1] text-sm font-medium font-be">
      <div className="mt-3 mb-8 flex items-center space-x-4 select-none justify-center">
        <img src="/footer-logo.png" alt="logo" className="h-12" />
        <div className="font-poppins font-bold text-[15px]">OMeeting</div>
      </div>
      {/* <div className="flex space-x-3">
        <div className="flex-1">
          <div className="font-black mb-4 text-[13px]">ABOUT</div>
          <ul className="space-y-3">
            <li>
              <a className="cursor-pointer">Our story</a>
            </li>
            <li>
              <a className="cursor-pointer">Team</a>
            </li>
            <li>
              <a className="cursor-pointer">Careers</a>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <div className="font-black mb-4 text-[13px]">GETTING STARTED</div>
          <ul className="space-y-3">
            <li>
              <a className="cursor-pointer">Introduction</a>
            </li>
            <li>
              <a className="cursor-pointer">Documentation</a>
            </li>
            <li>
              <a className="cursor-pointer">Usage</a>
            </li>
            <li>
              <a className="cursor-pointer">Global</a>
            </li>
            <li>
              <a className="cursor-pointer">Elements</a>
            </li>
            <li>
              <a className="cursor-pointer">Collections</a>
            </li>
            <li>
              <a className="cursor-pointer">Themes</a>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <div className="font-black mb-4 text-[13px]">RESOURCES</div>
          <ul className="space-y-3">
            <li>
              <a className="cursor-pointer">API</a>
            </li>
            <li>
              <a className="cursor-pointer">Visibility</a>
            </li>
            <li>
              <a className="cursor-pointer">Accessibility</a>
            </li>
            <li>
              <a className="cursor-pointer">Community</a>
            </li>
            <li>
              <a className="cursor-pointer">Marketplace</a>
            </li>
          </ul>
        </div>
        <div className="w-[30%] flex-shrink-0">
          <div className="font-black mb-4 text-[13px]">SOCIAL MEDIA</div>
          <div>
            Follow us on social media to find out the lastest updates on our
            progress.
          </div>
          <div className="flex mt-5 items-center space-x-7 text-lg">
            <FaFacebookF />
            <FaTwitter />
            <FaGithub />
            <FaYoutube />
            <FaInstagram />
          </div>
        </div>
      </div> */}
      <div>
        <ul className="flex space-x-8 justify-center">
          <li>
            <a className="cursor-pointer">Terms of Service</a>
          </li>
          <li>
            <a className="cursor-pointer">Privacy Policy</a>
          </li>
          <li>
            <a className="cursor-pointer">Security</a>
          </li>
          <li>
            <a className="cursor-pointer">Sitemap</a>
          </li>
        </ul>
      </div>
      <div className="mt-6 pt-5 flex items-center">
        <div className="flex-1">English</div>
        <div className="flex items-center space-x-7 text-xl w-[40%] justify-center">
          <FaFacebookF />
          <FaTwitter />
          <FaGithub />
          <FaYoutube />
          <FaInstagram />
        </div>
        <div className="flex-1 text-right">
          @2021 OMeeting. All rights reserved.
        </div>
      </div>
    </div>
  );
};
