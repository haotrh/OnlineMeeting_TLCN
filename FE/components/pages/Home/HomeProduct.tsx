/* eslint-disable @next/next/no-img-element */
interface HomeProductProps {
  title: string;
  content: string;
  link: string;
  linkText: string;
  image?: string;
}

const HomeProduct = ({
  title,
  content,
  link,
  linkText,
  image,
}: HomeProductProps) => {
  return (
    <div>
      <div>{image && <img src={image} alt="Product" />}</div>
    </div>
  );
};

export default HomeProduct;
