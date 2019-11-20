import React, {useState} from 'react';

import store from 'store';
import gql from 'graphql-tag';
import {useRouter} from 'next/router';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {composeGid} from '@shopify/admin-graphql-api-utilities';

import {Page, Layout, Spinner} from '@shopify/polaris';
import {TitleBar, Toast} from '@shopify/app-bridge-react';

import DiscountFrom from '../../components/DiscountForm';

const GET_PRODUCT = gql`
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      title
      descriptionHtml
      images(first: 1) {
        edges {
          node {
            originalSrc
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            price
            id
          }
        }
      }
    }
  }
`;

const UPDATE_VARIANT = gql`
  mutation productVariantUpdate($variant: ProductVariantInput!) {
    productVariantUpdate(input: $variant) {
      product {
        id
        variants(first: 1) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
      productVariant {
        id
        price
      }
    }
  }
`;

const EditProduct = () => {
  const {
    query: {id},
  } = useRouter();
  const preferences = store.get('preferences');
  const [showToast, setShowToast] = useState(false);
  const {loading, error, data} = useQuery(GET_PRODUCT, {
    variables: {id: composeGid('Product', Number(id))},
  });
  const [updateVariant] = useMutation(UPDATE_VARIANT);

  const shouldUpdate = preferences == null || preferences.active !== false;

  const handleOnSubmit = (variant) => {
    if (shouldUpdate) {
      updateVariant({variables: {variant}});
    }
    setShowToast(true);
  };

  const loadingMarkup = loading ? (
    <Spinner
      color="teal"
      size="large"
      accessibilityLabel="Chargement du produit"
    />
  ) : null;

  const formMarkup =
    !loading && error == null && data != null && data.product != null ? (
      <DiscountFrom product={data.product} onSubmit={handleOnSubmit} />
    ) : null;

  const toastContent = shouldUpdate
    ? 'Changements sauvegardés'
    : 'Changements sauvegardés - (Test)';

  const toastMarkup = showToast ? (
    <Toast content={toastContent} onDismiss={() => setShowToast(false)} />
  ) : null;

  if (error != null) {
    console.error(error);
  }

  return (
    <Page>
      <TitleBar title="Produits" />
      <Layout>
        {toastMarkup}
        {loadingMarkup}
        {formMarkup}
      </Layout>
    </Page>
  );
};

export default EditProduct;
