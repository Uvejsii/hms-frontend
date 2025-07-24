<script setup>
import {formatDate} from "@/utils/helpers.js";
import {Plus, EditPencil, Trash} from "@iconoir/vue";
import {inject} from "vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import {useUser} from "@/modules/auth/sdk/user.js";

const props = defineProps(['data'])
const { user } = useUser()

const showAddReviewPopup = inject('showAddDoctorReviewPopup')
const addReview = (data) => {
  showAddReviewPopup({...data, drKey: props.data.drKey})
}

const showEditDoctorReviewPopup = inject('showEditDoctorReviewPopup')
const editReview = (data) => {
  showEditDoctorReviewPopup({...data, drKey: props.data.drKey})
}

const showDeleteDoctorReviewPopup = inject('showDeleteDoctorReviewPopup')
const deleteReview = (data) => {
  showDeleteDoctorReviewPopup({...data, drKey: props.data.drKey})
}
</script>

<template>
  <div class="reviews-content">
      <div class="reviews-summary">
        <div class="rating-breakdown">
          <div class="overall-rating">
            <div class="left-rating">
              <span class="rating-number">{{ props.data.rating }}</span>
              <Rating :modelValue="props.data.reviewStarAverage" readonly :cancel="false" />
              <span class="review-count">{{ props.data.totalReviewsCount }} reviews</span>
            </div>
            <Button outlined @click="addReview(props.data)"><Plus/> Add review</Button>
          </div>
        </div>
      </div>
      <div class="reviews-list">
        <div v-for="review in props?.data.reviews" :key="review?.id" class="review-item">
          <div class="review-header">
            <div class="reviewer-info">
              <Avatar :label="review?.reviewer?.firstName[0] + review?.reviewer?.lastName[0]" size="small" />
              <div class="reviewer-details">
                <span class="reviewer-name">{{ review.reviewer?.firstName }} {{ review.reviewer?.lastName }}</span>
                <span class="review-date">
                  {{ review.updatedAt === '0001-01-01T00:00:00' ? formatDate(review.createdAt) : `Edited at ${formatDate(review.updatedAt)}` }}
                </span>
              </div>
            </div>
            <Rating :modelValue="review.stars" readonly :cancel="false" />
          </div>
          <div class="d-flex justify-content-between">
            <p class="review-text">{{ review.comment }}</p>
            <ActionMenu v-if="user?.id === review.reviewer?.id">
              <ActionMenuItem @click="editReview(review)">
                <EditPencil/>Edit
              </ActionMenuItem>
              <ActionMenuItem severity="danger" @click="deleteReview(review)">
                <Trash/> Delete
              </ActionMenuItem>
            </ActionMenu>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
.reviews-content {
  padding: var(--spacing-md) 0;
}

.reviews-summary {
  margin-bottom: var(--spacing-lg);
}

.overall-rating {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.rating-number {
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.review-count {
  color: var(--text-secondary);
}

.reviews-list {
  max-height: 300px;
  overflow-y: auto;
}

.review-item {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--surface-border);
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.reviewer-details {
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  font-weight: var(--font-weight-semibold);
}

.review-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.review-text {
  margin: 0;
  line-height: 1.5;
}
</style>