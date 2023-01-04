import cn from 'classnames';
import { Text, View } from 'src/components/common';
import Logo from 'src/components/Logo';

const Header = () => {
  return (
    <View fullWidth justify="center" align="center" className="mb-32">
      <View>
        <Logo className="mb-16" />
      </View>

      <Text size={16} className={cn('text-color-grey-900')}>
        The Research Corporation of the University of Hawaii
      </Text>
      <Text size={20} className={cn('fw-bold  text-color-grey-900')}>
        Financial System Login
      </Text>
    </View>
  );
};

export default Header;
