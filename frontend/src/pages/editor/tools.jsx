import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  image: {
    class: Image,
    config: {
      endpoints: {
        byFile: 'http://localhost:5000/upload',
        byUrl: 'http://localhost:5000/upload',
      },
      field: 'file',
    }
  },
  header: {
    class: Header,
    config: {
      placeholder: "Enter header",
      levels: [2, 3, 4],
      defaultLevel: 3,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
  },
  marker: Marker,
  inlineCode: InlineCode,
};
