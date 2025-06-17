import React, { useMemo, useState } from "react";
import type { CollectionEntry } from "astro:content";
import { Pagination } from "../Pagination.tsx";
import { CommunityCard } from "../Card/CommunityCard.tsx";
import { LuCalendar } from "react-icons/lu";

interface ICommunityListComponent {
    communities: CollectionEntry<"communities">[];
}

export const CommunitiesList = ({ communities }: ICommunityListComponent) => {
    const [selectedCity, setSelectedCity] = useState("Toutes les villes");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const communitiesPerPage = 4;

    console.log(communities);

    const allCities = useMemo(() => {
        return communities.map(cityData => cityData.data?.city).filter(Boolean) || [];
    }, [communities]);

    const filteredCities = useMemo(() => {
        return selectedCity === "Toutes les villes"
            ? communities
            : communities.filter(cityData => cityData.data?.city === selectedCity);
    }, [communities, selectedCity]);

    const allCommunities = useMemo(() => {
        return filteredCities.flatMap(cityData => {
            // Vérifier que cityData.data et cityData.data.communities existent
            if (!cityData.data || !cityData.data.communities) {
                return [];
            }

            return cityData.data.communities.map(community => ({
                ...community,
                city: cityData.data.city
            }));
        });
    }, [filteredCities]);

    const filteredCommunities = useMemo(() => {
        if (!searchValue) return allCommunities;

        return allCommunities.filter(community =>
            community.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [allCommunities, searchValue]);

    const totalPages = Math.ceil(filteredCommunities.length / communitiesPerPage);

    const paginatedCommunities = useMemo(() => {
        const startIndex = (currentPage - 1) * communitiesPerPage;
        return filteredCommunities.slice(startIndex, startIndex + communitiesPerPage);
    }, [filteredCommunities, currentPage]);

    const handleSelectCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCity = e.target.value;
        setSelectedCity(newCity);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleSearchCommunity = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setSearchValue(newSearch);
        setCurrentPage(1);
    };

    // Correction de la logique de pagination
    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <section role="list" className="flex flex-col">
            <section role="form" className="flex justify-between items-center flex-wrap md:flex-nowrap">
                <form className="m-8 flex items-center flex-wrap md:flex-nowrap w-full md:w-auto">
                    <select
                        id="city_select"
                        className="border border-[#DEDEDE] text-[#6D6D6D] rounded-lg text-sm h-12 md:mr-4 p-2.5 outline-none w-full md:w-56 mb-2 md:mb-0"
                        onChange={handleSelectCity}
                        value={selectedCity}
                    >
                        <option>Toutes les villes</option>
                        {allCities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Rechercher une communauté"
                        className="border border-[#DEDEDE] placeholder-[#6D6D6D] rounded-lg h-12 p-2.5 text-sm outline-none w-full md:w-56"
                        onChange={handleSearchCommunity}
                        value={searchValue}
                    />
                </form>

                <button
                    type="button"
                    className="flex items-center justify-center cursor-pointer mt-0 md:mt-8 m-8 p-2.5 h-12 text-sm bg-[#4C40CF] text-white rounded-lg whitespace-nowrap"
                    onClick={() => window.location.href = "/events"}
                >
                    <LuCalendar size={20} className="mr-2" />
                    <span className="mt-1">Voir les événements</span>
                </button>
            </section>

            <span className="mx-8 text-sm text-[#6D6D6D] italic">{filteredCommunities.length} communautés</span>

            {paginatedCommunities.length > 0 ? (
                <>
                    <ul className="mx-8 grid grid-cols-1 gap-2">
                        {paginatedCommunities.map(community => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                            />
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
