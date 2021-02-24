import dayjs from 'dayjs';
import { __ } from 'modules/common/utils';
import { GENDER_TYPES } from 'modules/customers/constants';
import { ICustomer } from 'modules/customers/types';
import {
  FieldStyle,
  SidebarCounter,
  SidebarFlexRow,
  SidebarList
} from 'modules/layout/styles';
import { IField } from 'modules/settings/properties/types';
import React from 'react';
import PrimaryEmail from './PrimaryEmail';
import PrimaryPhone from './PrimaryPhone';

type Props = {
  customer: ICustomer;
  hasPosition?: boolean;
  fields: IField[];
  isDetail: boolean;
};

class DetailInfo extends React.PureComponent<Props> {
  renderRow(label, value) {
    const { fields, isDetail } = this.props;

    const field = fields.find(e => e.text === label);

    const isVisibleKey = isDetail ? 'isVisibleInDetail' : 'isVisible';

    if (field && !field[isVisibleKey]) {
      return;
    }

    return (
      <li>
        <FieldStyle>{__(`${label}`)}:</FieldStyle>
        <SidebarCounter fullLength={label === 'Description'}>
          {value || '-'}
        </SidebarCounter>
      </li>
    );
  }

  renderEmail(status?: string, email?: string) {
    return (
      <li>
        <FieldStyle>{__('Primary Email')}:</FieldStyle>
        <SidebarCounter>
          <PrimaryEmail email={email} status={status} />
        </SidebarCounter>
      </li>
    );
  }

  renderPhone(status?: string, phone?: string) {
    return (
      <li>
        <FieldStyle>{__('Primary phone')}:</FieldStyle>
        <SidebarCounter>
          <PrimaryPhone phone={phone} status={status} />
        </SidebarCounter>
      </li>
    );
  }

  renderDescription(description?: string) {
    const { fields, isDetail } = this.props;

    const descriptionField = fields.find(e => e.text === 'Description');

    const isVisibleKey = isDetail ? 'isVisibleInDetail' : 'isVisible';

    if (descriptionField && !descriptionField[isVisibleKey]) {
      return;
    }

    return (
      <SidebarFlexRow>
        {descriptionField && descriptionField[isVisibleKey]}
        {__(`Description`)}:<span>{description || '-'}</span>
      </SidebarFlexRow>
    );
  }

  renderPosition(customer) {
    if (!this.props.hasPosition) {
      return null;
    }

    return this.renderRow('Position', customer.position);
  }

  render() {
    const { customer } = this.props;

    return (
      <SidebarList className="no-link">
        {this.renderRow('Code', customer.code)}
        {this.renderEmail(
          customer.emailValidationStatus,
          customer.primaryEmail
        )}
        {this.renderPhone(
          customer.phoneValidationStatus,
          customer.primaryPhone
        )}
        {this.renderPosition(customer)}
        {this.renderRow(
          'Owner',
          customer.owner && customer.owner.details
            ? customer.owner.details.fullName
            : ''
        )}
        {this.renderRow('Department', customer.department)}
        {this.renderRow('Pronoun', GENDER_TYPES()[customer.sex || 0])}
        {this.renderRow(
          'Birthday',
          customer.birthDate && dayjs(customer.birthDate).format('MMM,DD YYYY')
        )}
        {this.renderRow('Do not disturb', customer.doNotDisturb)}
        {this.renderDescription(customer.description)}
      </SidebarList>
    );
  }
}

export default DetailInfo;
