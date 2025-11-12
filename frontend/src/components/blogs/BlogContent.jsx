const Img = ({ url, caption }) => {
  return (
    <div className="w-full flex flex-col justify-center text-center my-5 border-r-[50%]">
      <img src={url} alt="Preview" />
      {caption && (
        <p className="font-inter text-2xl font-medium max-md:text-xl py-5">
          {caption}
        </p>
      )}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <div className="my-4 border-l-4 border-[#c977e0] bg-[#d6b9de] p-4 dark:border-gray-500 dark:bg-gray-800">
      <p className="font-inter text-xl font-medium">{quote}</p>
      <p className="py-4 text-left">{`<${caption} />`}</p>
    </div>
  );
};

const List = ({ style, items }) => {
  return (
    <ol
      className={`pl-5 ${style === "ordered" ? " list-decimal" : " list-disc"}`}
    >
      {items.map((item, index) => {
        return (
          <li
            key={index}
            className="my-2"
            dangerouslySetInnerHTML={{ __html: item }}
          ></li>
        );
      })}
    </ol>
  );
};

export const BlogContent = ({ block }) => {
  let { type, data } = block;

  if (type === "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }

  if (type === "header") {
    if (data.level === 3) {
      return (
        <h3
          className="text-3x1 font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    }
    return (
      <h2
        className="text-4x1 font-bold"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></h2>
    );
  }

  if (type === "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  }

  if (type === "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }

  if (type === "list") {
    return <List style={data.style} items={data.items} />;
  }
};
