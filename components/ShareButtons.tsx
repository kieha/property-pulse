import {
  FacebookShareButton,
  XShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  XIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
import type { Property } from "@/utils/types";

const ShareButtons = ({ property }: { property: Property }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;

  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Share This Property:
      </h3>

      <div className="flex gap-3 justify-center pb-5">
        <FacebookShareButton
          title={property.name}
          url={shareUrl}
          hashtag={`#${property.type.replace(/\s/g, "")}ForRent`}
        >
          <FacebookIcon size={40} round={true} />
        </FacebookShareButton>

        <XShareButton
          title={property.name}
          url={shareUrl}
          hashtags={[`${property.type.replace(/\s/g, "")}ForRent`]}
        >
          <XIcon size={40} round={true} />
        </XShareButton>

        <WhatsappShareButton
          title={property.name}
          url={shareUrl}
          separator=": "
        >
          <WhatsappIcon size={40} round={true} />
        </WhatsappShareButton>

        <EmailShareButton
          subject={property.name}
          body={`Check out this property listing:`}
          url={shareUrl}
        >
          <EmailIcon size={40} round={true} />
        </EmailShareButton>
      </div>
    </>
  );
};

export default ShareButtons;
