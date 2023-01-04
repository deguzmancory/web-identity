import React from 'react';
import { View } from 'src/components/common';
import Header from '../Header';

const Body: React.FC<Props> = ({ children }) => {
  return (
    <View className="ctn-uam" flexGrow={1}>
      <View className="ctn-uam__container--wrap" flexGrow={1}>
        <View className="ctn-uam__container" flexGrow={1}>
          <Header />

          {children}
        </View>
      </View>
    </View>
  );
};

type Props = {
  children: React.ReactNode;
};

export default Body;
