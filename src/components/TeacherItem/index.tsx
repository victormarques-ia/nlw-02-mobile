import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { Container, Profile, Avatar,ProfileInfo, Name, Subject, Bio, Footer, Price, PriceValue, ButtonsContainer, FavoriteButton, ContactButton, ContactButtonText } from './styles';
import { RectButton } from 'react-native-gesture-handler';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteiIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';
import api from '../../services/api';

export interface Teacher {
  id: number;
  avatar: string;
  bio: string;
  cost: number;
  name: string;
  subject: string;
  whatsapp: string;
}

interface TeahcerItemProps {
  teacher: Teacher;
  favorited: boolean;
}

const TeacherItem: React.FC<TeahcerItemProps> = ({ teacher, favorited }) => {
  const [isFavorited, setIsFavorited] = useState(favorited);

  function handleLinkToWhatsapp() {
    api.post('connections', {
      user_id: teacher.id,
    });
    Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`);
  }

  async function handleToggleFavorite() {
    const favorites = await AsyncStorage.getItem('favorites');

    let favoritesArray = [];

    if (favorites) {
      favoritesArray = JSON.parse(favorites);
    }

    if (isFavorited) {
      // Remover dos favoritos
      const favoriteIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
        return teacherItem.id === teacher.id;
      });

      favoritesArray.splice(favoriteIndex, 1);

      setIsFavorited(false);
    } else {
      // Adicionar aos favoritos

      favoritesArray.push(teacher);

      setIsFavorited(true);
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
  }

  return (
    <Container>
      <Profile>
        <Avatar source={{ uri: teacher.avatar }} />
        <ProfileInfo>
          <Name>{teacher.name}</Name>
          <Subject>{teacher.subject}</Subject>
        </ProfileInfo>
      </Profile>

      <Bio>{teacher.bio}</Bio>

      <Footer>
        <Price>
          Preço/hora {'  '}
          <PriceValue>R$ {teacher.cost}</PriceValue>
        </Price>
        <ButtonsContainer>
          <FavoriteButton
            onPress={handleToggleFavorite}
            style={isFavorited ? {
              backgroundColor: '#e33d3d'
            } : {}}
          >
            {isFavorited ? (
              <Image source={unfavoriteiIcon} />
            ) : (
              <Image source={heartOutlineIcon} />
            )}
          </FavoriteButton>
          <ContactButton
            onPress={handleLinkToWhatsapp}
          >
            <Image source={whatsappIcon} />
            <ContactButtonText>Entrar em contato</ContactButtonText>
          </ContactButton>
        </ButtonsContainer>
      </Footer>
    </Container>
  );
};

export default TeacherItem;
