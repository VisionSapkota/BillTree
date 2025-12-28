const Hero = ({ title, description }) => {
    return (
        <header className="bg-indigo-600 text-white py-16">
            <div className="max-w-4xl mx-auto text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {title}
                </h1>
                <p className="text-lg md:text-xl text-indigo-100">
                    Please read these {description} carefully before using our
                    website.
                </p>
            </div>
        </header>
    )
}

export default Hero