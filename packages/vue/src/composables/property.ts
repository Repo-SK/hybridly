import type { ComputedRef } from 'vue'
import { computed, readonly, toValue } from 'vue'
import { getByPath, setByPath } from '@clickbar/dot-diver'
import type { Path, PathValue, SearchableObject } from '@clickbar/dot-diver'
import { state } from '../stores/state'
import { toReactive } from '../utils'

/** Accesses all current properties. */
export function useProperties<T extends object, Global extends GlobalHybridlyProperties>() {
	return readonly(toReactive(computed(() => state.context.value?.view.properties as T & Global)))
}

/** Accesses a property with a dot notation. */
export function useProperty<
	Override = never,
	T extends SearchableObject = GlobalHybridlyProperties,
	P extends Path<T> & string = Path<T> & string,
	ReturnType = [Override] extends [never] ? PathValue<T, P> : Override
>(
	path: [Override] extends [never]
		? P
		: string,
): ComputedRef<ReturnType> {
	return computed(() => getByPath(state.context.value?.view.properties as GlobalHybridlyProperties, path) as ReturnType)
}

/**
 * Sets the property at the given path to the given value.
 * Note: this helper is experimental and may change in the future.
 */
export function setProperty<
	Override = never,
	T extends SearchableObject = GlobalHybridlyProperties,
	P extends Path<T> & string = Path<T> & string,
	ValueType = [Override] extends [never] ? PathValue<T, P> : Override
>(
	path: [Override] extends [never] ? P : string,
	value: ValueType,
): void {
	if (!state.context.value?.view.properties) {
		return
	}

	setByPath(state.context.value.view.properties as GlobalHybridlyProperties, path, toValue(value as any))
}
