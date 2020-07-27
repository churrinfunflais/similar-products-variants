/* eslint-disable no-console */
import { injectIntl } from 'react-intl'
import { SimilarProductsVariantsProps } from './typings/global'

import { useProduct } from 'vtex.product-context'
import { Query } from 'react-apollo'
import productRecommendationsQuery from './queries/productRecommendations.gql'
import path from 'ramda/es/path'
import React from 'react'

const SimilarProductsVariants: StorefrontFunctionComponent<
  SimilarProductsVariantsProps
> = ({ productQuery }) => {
  const productContext = useProduct()

  const productId =
    path(['product', 'productId'], productQuery) ||
    path(['product', 'productId'], productContext)

  return (
    <Query
      query={productRecommendationsQuery}
      variables={{
        identifier: { field: 'id', value: productId },
        type: `similars`,
      }}
    >
      {({ loading, error, data }: any) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`

        const { productRecommendations } = data

        const { products } = {
          products: productRecommendations || [],
        }

        const items = [...products].filter(product =>
          product.specificationGroups.filter(
            (group: { specifications: any[] }) =>
              group.specifications.filter(
                (spec: { name: string }) => spec.name == 'Color'
              )
          )
        )

        console.log('similar-products:', items)

        return items.map(element => (
          <a href={`/${element.linkText}/p`}>
            <img height="50px" src={element.items[0].images[0].imageUrl} />
          </a>
        ))
      }}
    </Query>
  )
}

SimilarProductsVariants.schema = {
  title: 'SimilarProducts Variants',
  description: 'SimilarProducts Variants',
  type: 'object',
  properties: {},
}

export default injectIntl(SimilarProductsVariants)
