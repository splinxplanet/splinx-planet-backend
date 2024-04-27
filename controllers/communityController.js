// community controller functions

const Community = require('../models/Community');

// create a new community
exports.createCommunity = async (req, res) => {
  try {
    const newCommunity = await Community.create(req.body);
    res.status(201).json(newCommunity);
  } catch (error) {
    res.status(500).json({ error: 'Could not create community' });
  }
};

// get all community
exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(404).json({ error: 'Communities not found' });
  }
};

// get a community by id
exports.getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    res.json(community);
  } catch (error) {
    res.status(404).json({ error: 'Community not found' });
  }
};

// add a member to a community
exports.addMember = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    community.communityMembers.push(req.body.member);
    await community.save();
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Could not add member' });
  }
};

// remove a member from a community
exports.removeMember = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    const index = community.communityMembers.indexOf(req.body.member);
    if (index !== -1) {
      community.communityMembers.splice(index, 1);
      await community.save();
    }
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Could not remove member' });
  }
};

// delete a community
exports.deleteCommunity = async (req, res) => {
  try {
    await Community.findByIdAndDelete(req.params.id);
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete community' });
  }
};
