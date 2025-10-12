interface ICommunity {
  community: {
    id: string;
    image: string;
    name: string;
    description: string;
    link: string;
    city: string;
    platform: string;
    organizers: Array<{
      id: string;
      name: string;
      role: string;
      bio: string;
      image: string;
      linkedin: string;
      twitter?: string;
      github?: string;
    }>;
    tags: Array<{
      id: string;
      name: string;
    }>;
    events: Array<{
      id: string;
      title: string;
      date: string;
      dateTime: string;
      description: string;
      link: string;
    }>;
  };
}

export const Community = ({ community }: ICommunity) => {
  return (
    <>
      <section role="contentinfo" className="md:mx-28 mx-4 mt-8">
        {community.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-3">
            {community.tags.map((tag) => (
              <li
                key={tag.id}
                className="px-2 py-1 bg-[#4C40CF]/10 text-[#4C40CF] text-xs rounded-full"
              >
                # {tag.name}
              </li>
            ))}
          </ul>
        )}

        <p className="text-sm leading-5.5 mb-3">{community.description}</p>

        <button
          onClick={() => window.open(community.link, "_blank")}
          className="px-4 py-2 bg-[#4C40CF] text-white rounded-md text-sm hover:bg-[#3b30a8] transition"
        >
          Rejoindre la communauté
        </button>
      </section>
    </>
  );
};
