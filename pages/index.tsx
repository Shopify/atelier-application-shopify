import React, {useState, useContext} from 'react';

import {Page, Layout, EmptyState} from '@shopify/polaris';
import {parseGid} from '@shopify/admin-graphql-api-utilities';
import {Redirect} from '@shopify/app-bridge/actions';
import {TitleBar, ResourcePicker, Context} from '@shopify/app-bridge-react';

const Index = () => {
  const app = useContext(Context);
  const [open, setOpen] = useState(false);
  const handleOnSelection = (resources) => {
    const productID = parseGid(resources.selection[0].id);
    Redirect.create(app).dispatch(
      Redirect.Action.APP,
      `/products/${productID}`,
    );
    setOpen(false);
  };

  return (
    <Page>
      <TitleBar
        title="Produits"
        primaryAction={{
          content: 'Sélectionner des produits',
          onAction: () => setOpen(true),
        }}
      />
      <Layout>
        <ResourcePicker
          open={open}
          resourceType="Product"
          showVariants={false}
          allowMultiple={false}
          onCancel={() => setOpen(false)}
          onSelection={handleOnSelection}
        />
        <EmptyState
          heading="Réduction temporaire du prix de vos produits"
          action={{
            content: 'Sélectionner un produit',
            onAction: () => setOpen(true),
          }}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        >
          <p>
            Sélectionnez des produits pour modifier leur prix temporairement.
          </p>
        </EmptyState>
      </Layout>
    </Page>
  );
};

export default Index;
