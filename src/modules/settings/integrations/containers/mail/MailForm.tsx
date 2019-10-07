import gql from 'graphql-tag';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { __, withProps } from 'modules/common/utils';
import { IMail } from 'modules/inbox/types';
import { mutations, queries } from 'modules/settings/integrations/graphql';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import MailForm from '../../components/mail/MailForm';
import { IntegrationsQueryResponse } from '../../types';

type Props = {
  integrationId?: string;
  refetchQueries?: string[];
  fromEmail?: string;
  kind: string;
  conversationDetails?: IMail;
  closeModal?: () => void;
};

type FinalProps = {
  gmailIntegrationsQuery: IntegrationsQueryResponse;
} & Props;

const MailFormContainer = (props: FinalProps) => {
  const {
    conversationDetails,
    integrationId,
    gmailIntegrationsQuery,
    refetchQueries,
    fromEmail,
    kind,
    closeModal
  } = props;

  if (gmailIntegrationsQuery.loading) {
    return <Spinner objective={true} />;
  }

  const integrations = gmailIntegrationsQuery.integrations || [];

  const renderButton = ({
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.integrationSendMail}
        variables={values}
        callback={callback}
        refetchQueries={refetchQueries}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage="You have successfully sent a email"
      >
        {__('Send')}
      </ButtonMutate>
    );
  };

  const updatedProps = {
    renderButton,
    integrations,
    integrationId,
    fromEmail,
    closeModal,
    kind,
    conversationDetails
  };

  return <MailForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, IntegrationsQueryResponse, { kind: string }>(
      gql(queries.integrations),
      {
        name: 'gmailIntegrationsQuery',
        options: ({ kind }) => {
          return {
            variables: { kind },
            fetchPolicy: 'network-only'
          };
        }
      }
    )
  )(MailFormContainer)
);
