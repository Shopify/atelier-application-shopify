import React, {useState} from 'react';
import {
  Page,
  Layout,
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  Stack,
  SettingToggle,
  TextStyle,
} from '@shopify/polaris';
import store from 'store';
import {TitleBar, Toast} from '@shopify/app-bridge-react';

const defaultPreferenceValue = {discount: '10', active: true};
const Preferences = () => {
  const preferences = store.get('preferences', defaultPreferenceValue);
  const [showToast, setShowToast] = useState(false);
  const [active, setActive] = useState(preferences.active);
  const [discount, setDiscount] = useState(preferences.discount);
  const handleSubmit = () => {
    store.set('preferences', {...preferences, discount});
    setShowToast(true);
  };

  const handleToggle = () => {
    setActive((value) => {
      const active = !value;
      store.set('preferences', {...preferences, active});
      return active;
    });
    setShowToast(true);
  };

  const contentStatus = active ? 'Déactiver' : 'Activer';
  const textStatus = active ? 'activé' : 'déactivé';

  const toastMarkup = showToast ? (
    <Toast
      content="Changements sauvegardés"
      onDismiss={() => setShowToast(false)}
    />
  ) : null;

  return (
    <Page title="Préférences">
      {toastMarkup}
      <TitleBar title="Préférences" />
      <Layout>
        <Layout.AnnotatedSection
          title="Pourcentage de rabais par défaut"
          description="Ajouter un produit dans votre application, il sera automatiquement réduit."
        >
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  suffix="%"
                  type="number"
                  value={discount}
                  onChange={setDiscount}
                  label="Pourcentage de rabais"
                />
                <Stack distribution="trailing">
                  <Button submit primary>
                    Sauvegarder
                  </Button>
                </Stack>
              </FormLayout>
            </Form>
          </Card>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          title="Mises à jour de prix"
          description="Désactiver temporairement toutes les mises à jour de prix"
        >
          <SettingToggle
            action={{
              content: contentStatus,
              onAction: handleToggle,
            }}
            enabled={active}
          >
            Ce réglage est{' '}
            <TextStyle variation="strong">{textStatus}</TextStyle>.
          </SettingToggle>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
};

export default Preferences;
