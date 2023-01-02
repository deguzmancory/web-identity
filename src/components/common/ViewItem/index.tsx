import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import { IRootState } from 'src/redux/rootReducer';
import './styles.scss';
import { Grid, View } from '..';
import { isEmpty } from 'src/validations';
import { Tooltip } from '@mui/material';
import { IoInformationCircle } from 'react-icons/io5';
import { COLOR_CODE } from 'src/appConfig/constants';

const ViewItem: React.FC<Props> = ({
  label,
  value,
  variant = 'is-half',
  infoTooltipMessage = '',
  infoTooltipPlacement = 'right',
  infoToolTipWithArrow = true,
}) => {
  const isEmptyLine = isEmpty(label) && isEmpty(value);

  if (isEmptyLine)
    return <Grid.Item variant={variant} className={cn('cmp-view-item__empty', variant)} />;

  return (
    <Grid.Item variant={variant} className={cn('cmp-view-item column')}>
      <View isRow align="center" className="cmp-view-item__label">
        {label}
        {infoTooltipMessage && (
          <span>
            <Tooltip
              arrow={infoToolTipWithArrow}
              title={infoTooltipMessage}
              placement={infoTooltipPlacement}
            >
              <i className="cursor-pointer ml-1">
                <IoInformationCircle
                  size={16}
                  color={COLOR_CODE.INFO}
                  style={{
                    transform: 'translateY(2px)',
                  }}
                />
              </i>
            </Tooltip>
          </span>
        )}
      </View>
      <View className="cmp-view-item__value">{value || '--'}</View>
    </Grid.Item>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    label?: string | React.ReactElement;
    value?: string | boolean | number | React.ReactElement;
    variant?:
      | 'is-three-quarters'
      | 'is-two-thirds'
      | 'is-half'
      | 'is-one-third'
      | 'is-one-quarter'
      | 'is-full';
    infoTooltipMessage?: string;
    infoTooltipPlacement?:
      | 'bottom-end'
      | 'bottom-start'
      | 'bottom'
      | 'left-end'
      | 'left-start'
      | 'left'
      | 'right-end'
      | 'right-start'
      | 'right'
      | 'top-end'
      | 'top-start'
      | 'top';
    infoToolTipWithArrow?: boolean;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ViewItem);
