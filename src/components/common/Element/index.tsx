import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import { IRootState } from 'src/redux/rootReducer';
import View from '../View';
import './styles.scss';
import { isEmpty } from 'src/validations';
import { ViewProps } from 'src/components/common/View';
import { Tooltip } from '@mui/material';
import { COLOR_CODE } from 'src/appConfig/constants';
import { IoInformationCircle } from 'react-icons/io5';

const Element: React.FC<Props> = ({
  id,
  children,
  errorMessage,
  label,
  className,
  subLabel,
  required,
  infoTooltipMessage = '',
  infoTooltipPlacement = 'right',
  infoToolTipWithArrow = true,
  ...props
}) => {
  const hasError = !isEmpty(errorMessage);
  const hasLabel = !isEmpty(label);
  const hasSubLabel = !isEmpty(subLabel);

  return (
    <View className={cn(className, 'form-element')} {...props}>
      {hasLabel && (
        <label
          htmlFor={id}
          style={{
            display: 'flex',
            flexFlow: 'row',
            alignItems: 'center',
            height: 24,
          }}
        >
          {label} {required && <span className="has-text-danger ml-1 fw-bold text-is-16">*</span>}
          {infoTooltipMessage && (
            <span>
              <Tooltip
                arrow={infoToolTipWithArrow}
                title={<span style={{ whiteSpace: 'pre-line' }}>{infoTooltipMessage}</span>}
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
        </label>
      )}

      {hasSubLabel && subLabel}
      {children}
      {hasError && <p className="form-element__error">{errorMessage}</p>}
    </View>
  );
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  ViewProps & {
    children: React.ReactNode;
    id?: string;
    label?: string | React.ReactNode;
    errorMessage?: string;
    className?: string;
    subLabel?: string | React.ReactNode;
    required?: boolean;
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

export default connect(mapStateToProps, mapDispatchToProps)(Element);
