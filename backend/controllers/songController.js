import axios from "axios";

const getSongs = async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.jamendo.com/v3.0/tracks/",
            {
                params: {
                    client_id: "71834d37",
                    format: "jsonpretty",
                    limit: 15,
                },
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPlayListBYTag = async (req, res) => {
    try {
        const tag = (req.params.tag || req.query.tag || "")
            .toString()
            .trim();

        if (!tag) {
            return res.status(400).json({ message: "Missing tag parameter" });
        }

        const limit = parseInt(req.query.limit ?? "10", 10) || 10;

        const response = await axios.get(
            "https://api.jamendo.com/v3.0/tracks/",
            {
                params: {
                    client_id: "71834d37",
                    format: "jsonpretty",
                    tags: tag,
                    limit,
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch playlist" });
    }
};

const toggleFavourite = async (req, res) => {
    try {
        const user = req.user;
        const song = req.body;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        user.favourites = user.favourites || [];

        const exists = user.favourites.find((fav) => fav.id === song.id);

        if (exists) {
            user.favourites = user.favourites.filter(
                (fav) => fav.id !== song.id
            );
        } else {
            user.favourites.push(song);
        }

        await user.save();
        res.status(200).json(user.favourites);
    } catch (error) {
        res.status(500).json({
            message: "Favourite not updated, something went wrong",
        });
    }
};

export { getSongs, getPlayListBYTag, toggleFavourite };
