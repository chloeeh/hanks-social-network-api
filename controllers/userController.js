/* ----------------------------------- USER ROUTES ----------------------------------- */
/*  GET all Users:               http://localhost:3001/api/users
    GET User by ID:              http://localhost:3001/api/users/[insert user ID here]
    CREATE new User:             http://localhost:3001/api/users/
    UPDATE existing User by ID:  http://localhost:3001/api/users/[insert user ID here]
    DELETE existing User by ID:  http://localhost:3001/api/users/[insert user ID here]

    ADD new Friend:              http://localhost:3001/api/users/[insert user ID here]/friends
    DELETE Friend by ID:         http://localhost:3001/api/users/[insert user ID here]/friends/[insert user ID here]

/* ----------------------------------- USER JSON BODIES ----------------------------------- */
/* To CREATE a new user, input the following in Insomnia JSON body:
{
	"username": "chloeeh",
	"email": "chloe.e.hanks@gmail.com",
	"thoughts": [],
	"friends": [
		"63fe39c51ab34120ca9a3c81"
	]
}

To UPDATE an existing User, input the followin in Insomnia JSON body:
{
	"username": "chlosef"
}
*/

/* ----------------------------------- USERS ----------------------------------- */


// Import User and Thought models
const { User, Thought } = require('../models');

// GET all users
function getAllUsers(req, res) {
    User.find({})
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
}

// Get a user by Id
function getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
        .populate('thoughts')
        .populate('friends')
        .select('-__v')
        .then((user) =>
            !user ? res.status(404).json({ message: 'No such user exists with this ID 😭' }) : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
}

// Create a user

function createUser(req, res) {
    User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
}

// Update a users information
function updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true })
        .then((user) =>
            !user ? res.status(404).json({ message: 'No such user exists with this ID 😭' }) : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
}

// Delete a user and its associated thoughts
function deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No such user exists with this ID 😭' })
                : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: '🙌 User and Thought deleted! 🙌' }))
        .catch((err) => res.status(500).json(err));
}

/* --------------------------- friend controllers --------------------------- */

// Add a friend and associate it with a user
function addFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
    )
        .then((user) =>
            !user ? res.status(404).json({ message: 'No such user exists with this ID 😭' }) : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
}

// Delete a friend
function deleteFriendById(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
        .then((user) =>
            !user ? res.status(404).json({ message: 'No such user exists with this ID 😭' }) : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, addFriend, deleteFriendById };