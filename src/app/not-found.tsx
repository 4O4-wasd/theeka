const NotFound = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center flex-col gap-6 px-4">
            <a
                href="https://github.com/4O4-wasd"
                target="_blank"
                className="group outline-0"
            >
                <h1 className="text-8xl font-extrabold group-hover:underline group-focus:underline">
                    4O4
                </h1>
            </a>
            <p className="text-lg font-mono text-muted-foreground text-center">
                The page that you are trying to access does not exist
            </p>
        </div>
    );
};

export default NotFound;
