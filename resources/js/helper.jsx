

export const getDefaultAvatar = (gender, userId) => {
    // Define avatar arrays
    const maleAvatars = [
        'avatar_2.jpg', 'avatar_7.jpg', 'avatar_9.jpg', 'avatar_10.jpg',
        'avatar_12.jpg', 'avatar_13.jpg', 'avatar_14.jpg', 'avatar_15.jpg',
        'avatar_17.jpg', 'avatar_18.jpg', 'avatar_19.jpg', 'avatar_22.jpg', 'avatar_25.jpg'
    ];

    const femaleAvatars = [
        'avatar_1_female.jpg', 'avatar_3_female.jpg', 'avatar_4_female.jpg',
        'avatar_6_female.jpg', 'avatar_8_female.jpg', 'avatar_11_female.jpg',
        'avatar_16_female.jpg', 'avatar_20_female.jpg', 'avatar_21_female.jpg',
        'avatar_23_female.jpg', 'avatar_24_female.jpg'
    ];

    // Select avatar array based on gender
    const avatars = (gender === 'Female') ? femaleAvatars : maleAvatars;

    // Use modulo to get a consistent index based on user ID
    const index = userId % avatars.length;

    return `/assets/images/avatars/${avatars[index]}`;
};