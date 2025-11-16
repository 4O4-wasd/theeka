import React from "react";

const SearchLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="max-w-7xl pt-2 px-4 xl:px-0 mx-auto">{children}</div>
    );
};

export default SearchLayout;
