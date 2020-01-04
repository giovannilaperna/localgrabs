<template>
  <section class="section">
    <h1 class="title">My Deliveries</h1>

    <div v-if="delivering.length > 0" id="delivering" class="content">
      <h2 class="subtitle is-5">Open</h2>
      <b-table :data="delivering">
        <template slot-scope="props">
          <b-table-column label="ID">
            {{`${props.row.ref.substr(0,4)}.....${props.row.ref.substr(props.row.ref.length-4)}`}}
          </b-table-column>
          <b-table-column label="Buyer">
            {{props.row.product.user.name}}
          </b-table-column>
          <b-table-column label="Amazon ID">
            {{props.row.product.amazon_id}}
          </b-table-column>
          <b-table-column label="Destination">
            {{props.row.product.city}} [{{props.row.product.country}}]
          </b-table-column>
          <b-table-column label="Reward">
            {{ props.row.product.reward }}<span class="is-size-7">%</span> {{ props.row.product.specifications.price.reward }}<span class="is-size-7">USD</span>
          </b-table-column>
          <b-table-column numeric>
            <b-field grouped position="is-right">
              <p class="control">
                <nuxt-link :to="`/products/${props.row.ref}`" class="button is-primary is-outlined is-small">Open</nuxt-link>
              </p>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>

    <div v-if="delivered.length > 0" id="delivering" class="content">
      <h2 class="subtitle is-5">Close</h2>
      <b-table :data="delivering">
        <template slot-scope="props">
          <b-table-column label="ID">
            {{`${props.row.ref.substr(0,4)}.....${props.row.ref.substr(props.row.ref.length-4)}`}}
          </b-table-column>
          <b-table-column label="Buyer">
            {{props.row.product.user.name}}
          </b-table-column>
          <b-table-column label="Amazon ID">
            {{props.row.product.amazon_id}}
          </b-table-column>
          <b-table-column label="Destination">
            {{props.row.product.city}} [{{props.row.product.country}}]
          </b-table-column>
          <b-table-column label="Reward">
            {{ props.row.product.reward }}<span class="is-size-7">%</span> {{ props.row.product.specifications.price.reward }}<span class="is-size-7">USD</span>
          </b-table-column>
          <b-table-column numeric>
            <b-field grouped position="is-right">
              <p class="control">
                <nuxt-link :to="`/products/${props.row.ref}`" class="button is-primary is-outlined is-small">Open</nuxt-link>
              </p>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
import filter from 'lodash.filter'
export default {
  layout: 'account',
  middleware: 'auth',
  async asyncData ( { app, store }) {
    const { deliveries } = await app.$db.me.deliveries()
    const delivering = filter(deliveries, { status: 2 })
    const delivered = filter(deliveries, { status: 3 })
    return { delivering, delivered }
  }
}
</script>
