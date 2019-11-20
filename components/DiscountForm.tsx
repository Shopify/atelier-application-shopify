import React, {useState, useEffect} from 'react';

import {
  Stack,
  Thumbnail,
  Layout,
  DisplayText,
  Form,
  Card,
  FormLayout,
  TextField,
  PageActions,
} from '@shopify/polaris';
import store from 'store';
import {nodesFromEdges} from '@shopify/admin-graphql-api-utilities';

interface Image {
  originalSrc: string;
  altText: string;
}

interface Variant {
  id: string;
  price: string;
}

interface Props {
  product: {
    id: string;
    title: string;
    images: {
      edges: {
        node: Image;
      }[];
    };
    variants: {
      edges: {
        node: Variant;
      }[];
    };
  };
  onSubmit(variant: Variant): void;
}

function getDiscountValue(price: string) {
  const preferences = store.get('preferences', defaultPreferenceValue);
  return `${Number(price) -
    Number(price) * (Number(preferences.discount) / 100)}`;
}

const defaultPreferenceValue = {discount: '10', active: true};
const DiscountForm = ({product, onSubmit}: Props) => {
  const {title, images, variants} = product;
  const image = nodesFromEdges<Image>(images.edges)[0];
  const variant = nodesFromEdges<Variant>(variants.edges)[0];

  useEffect(() => {
    setDiscount(getDiscountValue(variant.price));
  }, [variant]);

  const [discount, setDiscount] = useState(getDiscountValue(variant.price));

  const handleOnSubmit = () => {
    onSubmit({
      id: variant.id,
      price: discount,
    });
  };

  return (
    <>
      <Layout.Section>
        <Stack alignment="center">
          <Thumbnail source={image.originalSrc} alt={image.altText} />
          <DisplayText size="large">{title}</DisplayText>
        </Stack>
      </Layout.Section>
      <Layout.Section>
        <Form onSubmit={handleOnSubmit}>
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  prefix="$"
                  value={variant.price}
                  disabled
                  label="Prix original"
                  type="number"
                />
                <TextField
                  prefix="$"
                  value={discount}
                  onChange={setDiscount}
                  label="Prix réduit"
                  type="number"
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
          <PageActions
            primaryAction={{
              content: 'Sauvegarder',
              onAction: handleOnSubmit,
            }}
          />
        </Form>
      </Layout.Section>
    </>
  );
};

export default DiscountForm;
