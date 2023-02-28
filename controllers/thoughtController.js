/* ----------------------------------- THOUGHT ROUTES ----------------------------------- */
/*  GET all Thoughts:               http://localhost:3001/api/thoughts
    GET Thought by ID:              http://localhost:3001/api/thoughts/[insert thought ID here]
    CREATE new Thought:             http://localhost:3001/api/thoughts/
    UPDATE existing Thought by ID:  http://localhost:3001/api/thoughts/[insert thought ID here]
    DELETE existing Thought by ID:  http://localhost:3001/api/thoughts/[insert thought ID here]

    CREATE new Reaction:            http://localhost:3001/api/thoughts/[insert thought ID here]/reactions
    DELETE Reaction by ID:          http://localhost:3001/api/thoughts/[insert thought ID here]/reactions/[insert reaction ID here]

/* ----------------------------------- THOUGHT JSON BODIES ----------------------------------- */
/* To CREATE a Thought, input the following in Insomnia:
{
	"thoughtText": "Not a single brain cell left lmao; help please",
	"username": "Mertie.Marvin17",
	"userId": "63fe39c51ab34120ca9a3c6f"
}

To UPDATE a Though, input the following in Insomnia: 
/* Input the following in insomnia:
{
	"thoughtText": "Not a single brain cell111 left; this is an update rev001"
}
*/

/* ----------------------------------- THOUGHTS ----------------------------------- */

// Import data models for users, thoughts and reactions
const { User, Thought } = require('../models');


// GET all thoughts
function getThoughts(req, res) {
    // finds all thoughts (no filter applied) then converts into JSON format
    Thought.find({})
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
}

// GET a single thought by id
function getThoughtById(req, res) {
    // find single thought based on _id; searches for the id parameter with a specific id value
    Thought.findOne({ _id: req.params.thoughtId })
    // excludes the version associated with this command
        .select('-__v')
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'There is no thought with this ID! 😭' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}

// Create a thought

function createThought(req, res) {
    Thought.create(req.body)
        .then(({ _id }) => User.findOneAndUpdate({ _id: req.body.userId }, { $push: { thoughts: _id } }, { new: true }))
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'There is no user with this ID! 😭' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}

// Update a thought
function updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, New: true })
        .then((user) =>
            !user ? res.status(404).json({ message: 'There is no thought with this ID! 😭' }) : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
}

// Delete a thought
function deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'There is no thought with this ID! 😭' })
                : User.findOneAndUpdate(
                      { thoughts: req.params.thoughtId },
                      { $pull: { thoughts: req.params.thoughtId } },
                      { new: true }
                  )
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'Thought deleted, but no user found 😢' })
                : res.json({ message: 'Thought successfully deleted 🙌' })
        )
        .catch((err) => res.status(500).json(err));
}

/* -------------------------------- reactions ------------------------------- */

// Create a reaction
function createReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
    )
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'There is no reaction with this ID! 😭' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}

// Delete a reaction
function deleteReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
    )
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'There is no reaction with this ID! 😭' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}

// Export all controller functions
module.exports = {
    getThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction,
};