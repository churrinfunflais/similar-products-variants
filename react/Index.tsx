/* eslint-disable no-console */
import React from 'react'
import { injectIntl } from 'react-intl'
import { SimilarProductsVariantsProps } from './typings/global'

import { useProduct } from 'vtex.product-context'
import { Query } from 'react-apollo'
import productRecommendationsQuery from './queries/productRecommendations.gql'
import path from 'ramda/es/path'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['variants', 'title', 'var-wrap', 'img_wrap', 'img'] as const

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
        if (loading || error) return null

        const { productRecommendations } = data

        const { products } = {
          products: productRecommendations || [],
        }

        const unique = [...new Set(products.map((item: any) => item.productId))]

        let items: any[] = []

        unique.forEach(id => {
          const item = products.find(
            (element: { productId: any }) => element.productId == id
          )

          if (item) items.push(item)
        })

        return (
          <div className={`${handles.variants}`}>
            <p className={`${handles.title}`}>Colores</p>
            <div className={`${handles.var_wrap}`}>
              {items.map(
                (element: {
                  productId: string
                  linkText: any
                  items: { images: { imageUrl: string | undefined }[] }[]
                }) => {
                  return (
                    <a href={`/${element.linkText}/p`} className={`${handles.img_wrap}${
                      element.productId == productContext.product.productId
                        ? '--is-active'
                        : ''
                      }`}>
                      <img src={element.items[0].images[0].imageUrl}
                        height="50px"
                        className={`${handles.img} mr3 ${
                          element.productId == productContext.product.productId
                            ? 'o-50'
                            : ''
                          }`}
                      />
                    </a>
                  )
                }
              )}
            </div>
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
