const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/users");
const { imageUpload } = require("../utils/image-kit");
const { Unauthorized } = require("../utils/request");
const bcrypt = require("bcrypt");



exports.register = async (data,file) => {
    //if there are any file profile picture
    if (file?.profile_picture) {
        data.profile_picture = await imageUpload(file.profile_picture);
    }    

    //create user
    const user = await userRepository.createUser(data);

    //generate token
    const payload = {
        user_id : user.id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "72h",}); //exp in 3 days

    //dont forget to remove the password object, if not removed it will be displayed in response
    delete user.password;

    //return the user info and token
    return{
        user,
        token,
    }
}

exports.login = async (email, password) => {
    // get user by email
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        throw new Unauthorized("Email is not found!");
    }

    // compare the password
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
        throw new Unauthorized("Incorrect password!");
    }

    // generate token
    const token = createToken(user);

    // don't forget to remove the password object, if not removed it will be displayed in response
    delete user.password;

    // return the user info and the token
    return {
        user,
        token,
    };
};

exports.googleLogin = async (accessToken) => {
    // get information of access token by google api
    const { email, name, picture } = await userRepository.googleLogin(
        accessToken
    );
    // check is user already have an account
    let user = await userRepository.getUserByEmail(email);
    if (!user) {
        // register the user
        user = await userRepository.createUser({
            email,
            name,
            profile_picture: picture,
            password: "",
            phone:"",
        });
    }
    // create the token
    const token = createToken(user);
    // don't forget to remove the password object, if not removed it will be displayed in response
    delete user.password;
    return { user, token };
};

const createToken = (user) => {
    // generate token with jwt
    const payload = {
        user_id: user.id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "72h", // expired in 3 days
    });

    return token;
};

exports.updateProfile = async (userId, body, file) => {
  // Ambil user lama
  const user = await userRepository.getUserById(userId);
  if (!user) throw new Unauthorized('User not found');

  // Build data yang boleh diubah
  const updateData = {};
  if (body.name) updateData.name = body.name;
  if (body.phone) updateData.phone = body.phone;

  // Jika ada upload foto
  if (file?.profile_picture) {
    updateData.profile_picture = await imageUpload(file.profile_picture);
  }

  // Tidak boleh ganti password di sini
  const updatedUser = await userRepository.updateUser(userId, updateData);

  delete updatedUser.password;
  return updatedUser;
};