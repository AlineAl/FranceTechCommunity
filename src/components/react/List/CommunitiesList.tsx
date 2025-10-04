import { useMemo, useState, useEffect } from "react";
import type { CollectionEntry } from "astro:content";
import { Pagination } from "../Pagination.tsx";
import { CommunityCard } from "../Card/CommunityCard.tsx";
import { SearchBar } from "../SearchBar/SearchBar.tsx";

interface ICommunityListComponent {
  communities: CollectionEntry<"communities">[];
}

export const CommunitiesList = ({ communities }: ICommunityListComponent) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCity") || "Toutes les villes";
    }
    return "Toutes les villes";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const communitiesPerPage = 4;

  const allCities = useMemo(() => {
    return (
      communities.map((cityData) => cityData.data?.city).filter(Boolean) || []
    );
  }, [communities]);

  const filteredCities = useMemo(() => {
    return selectedCity === "Toutes les villes"
      ? communities
      : communities.filter((cityData) => cityData.data?.city === selectedCity);
  }, [communities, selectedCity]);

  const allCommunities = useMemo(() => {
    return filteredCities.flatMap((cityData) => {
      if (!cityData.data || !cityData.data.communities) {
        return [];
      }

      return cityData.data.communities.map((community) => ({
        ...community,
        city: cityData.data.city,
      }));
    });
  }, [filteredCities]);

  const filteredCommunities = useMemo(() => {
    if (!searchValue) return allCommunities;

    return allCommunities.filter((community) =>
      community.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [allCommunities, searchValue]);

  const totalPages = Math.ceil(filteredCommunities.length / communitiesPerPage);

  const paginatedCommunities = useMemo(() => {
    const startIndex = (currentPage - 1) * communitiesPerPage;
    return filteredCommunities.slice(
      startIndex,
      startIndex + communitiesPerPage,
    );
  }, [filteredCommunities, currentPage]);

  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchValue(newSearch);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCity", selectedCity);
    }
  }, [selectedCity]);

  return (
    <section role="list" className="mx-28 mt-8">
      <SearchBar
        cities={allCities}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Rechercher une communauté"
        showEventsButton={true}
        eventsButtonText="Voir les événements"
      />

      <span className="text-sm text-[#6D6D6D] italic mt-8 block">
        {filteredCommunities.length} communautés
      </span>

      {paginatedCommunities.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 gap-2">
            {paginatedCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center mt-4 text-lg font-semibold">
          Aucune communauté trouvée pour {selectedCity}.
        </p>
      )}
    </section>
  );
};
