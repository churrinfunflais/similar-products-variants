/* eslint-disable no-console */
import { injectIntl } from 'react-intl'
import { SimilarProductsVariantsProps } from './typings/global'

import { useProduct } from 'vtex.product-context'
import { Query } from 'react-apollo'
import productRecommendationsQuery from './queries/productRecommendations.gql'
import path from 'ramda/es/path'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['variants','title', 'img'] as const

const SimilarProductsVariants: StorefrontFunctionComponent<
  SimilarProductsVariantsProps
> = ({ productQuery }) => {
  const handles = useCssHandles(CSS_HANDLES)
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

        return (
          <div className={`${handles.variants}`}>
            {items.map(element => (
              <div>
                <p className={`${handles.variants}`}>Colores</p>
                <a href={`/${element.linkText}/p`} className={`${handles.img}`}>
                  <img
                    height="50px"
                    src={element.items[0].images[0].imageUrl}
                  />
                </a>
              </div>
            ))}
          </div>
        )
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
