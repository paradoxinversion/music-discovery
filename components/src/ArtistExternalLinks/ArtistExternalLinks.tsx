import { Icon, IconName } from "../Icons/Icons";

export interface ArtistExternalLinksProps {
  containerClasses?: string;
  links: { [key: string]: string | undefined };
  linkContainerType: "list" | "cloud";
  hideLinkTitle?: boolean;
}

export default function ArtistExternalLinks({
  links,
  containerClasses = "mt-2",
  linkContainerType = "list",
  hideLinkTitle = false,
}: ArtistExternalLinksProps) {
  return (
    <div id="artist-external-links" className={containerClasses}>
      <h2 className="text-xl font-semibold">Social Links</h2>
      <div
        id="links-container"
        className={
          linkContainerType === "cloud" ? "max-w-md flex flex-wrap gap-2" : ""
        }
      >
        {links &&
          Object.keys(links).map((key) => {
            const url = links[key];
            if (url) {
              return (
                <a
                  href={url}
                  className="max-w-max flex items-center gap-1 hover:underline"
                  key={key}
                  target="_blank"
                >
                  <Icon size="small" icon={key as IconName} />
                  {!hideLinkTitle && key.charAt(0).toUpperCase() + key.slice(1)}
                </a>
              );
            }
            return null;
          })}
      </div>
    </div>
  );
}
