import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { ShoColors } from '@/constants/sho-theme';

export type ShoIconName =
  | 'home'
  | 'explore'
  | 'search'
  | 'shopping_bag'
  | 'shopping_cart'
  | 'person'
  | 'favorite'
  | 'favorite_border'
  | 'tune'
  | 'arrow_back'
  | 'arrow_forward'
  | 'close'
  | 'delete'
  | 'delete_sweep'
  | 'check'
  | 'star'
  | 'add'
  | 'remove'
  | 'local_shipping'
  | 'verified'
  | 'straighten'
  | 'ios_share'
  | 'credit_card'
  | 'account_balance_wallet'
  | 'payments'
  | 'location_on'
  | 'call'
  | 'lock'
  | 'notifications'
  | 'inventory_2'
  | 'dashboard'
  | 'receipt_long'
  | 'group'
  | 'admin_panel_settings'
  | 'mail'
  | 'logout'
  | 'chevron_right'
  | '360'
  | 'info'
  | 'visibility'
  | 'visibility_off';

// Map common intent names to valid expo-symbols / SF Symbols / Material Symbol identifiers
const SYMBOL_MAPPING: Record<string, { ios: any; android: any; web: any }> = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  explore: { ios: 'safari', android: 'explore', web: 'explore' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  shopping_bag: { ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' },
  shopping_cart: { ios: 'cart.fill', android: 'shopping_cart', web: 'shopping_cart' },
  person: { ios: 'person.crop.circle.fill', android: 'person', web: 'person' },
  favorite: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  favorite_border: { ios: 'heart', android: 'favorite_border', web: 'favorite_border' },
  tune: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' },
  arrow_back: { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' },
  arrow_forward: { ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  delete: { ios: 'trash', android: 'delete', web: 'delete' },
  delete_sweep: { ios: 'trash.fill', android: 'delete_sweep', web: 'delete_sweep' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  star: { ios: 'star.fill', android: 'star', web: 'star' },
  add: { ios: 'plus', android: 'add', web: 'add' },
  remove: { ios: 'minus', android: 'remove', web: 'remove' },
  local_shipping: { ios: 'shippingbox.fill', android: 'local_shipping', web: 'local_shipping' },
  verified: { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' },
  straighten: { ios: 'ruler', android: 'straighten', web: 'straighten' },
  ios_share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  credit_card: { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' },
  account_balance_wallet: { ios: 'wallet.pass.fill', android: 'account_balance_wallet', web: 'account_balance_wallet' },
  payments: { ios: 'banknote.fill', android: 'payments', web: 'payments' },
  location_on: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  call: { ios: 'phone.fill', android: 'call', web: 'call' },
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' },
  notifications: { ios: 'bell.fill', android: 'notifications', web: 'notifications' },
  inventory_2: { ios: 'archivebox.fill', android: 'inventory_2', web: 'inventory_2' },
  dashboard: { ios: 'square.grid.2x2.fill', android: 'dashboard', web: 'dashboard' },
  receipt_long: { ios: 'doc.plaintext.fill', android: 'receipt_long', web: 'receipt_long' },
  group: { ios: 'person.2.fill', android: 'group', web: 'group' },
  admin_panel_settings: { ios: 'shield.lefthalf.filled', android: 'admin_panel_settings', web: 'admin_panel_settings' },
  mail: { ios: 'envelope.fill', android: 'mail', web: 'mail' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
  chevron_right: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  '360': { ios: 'rotate.3d', android: '360', web: '360' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  visibility: { ios: 'eye.fill', android: 'visibility', web: 'visibility' },
  visibility_off: { ios: 'eye.slash.fill', android: 'visibility_off', web: 'visibility_off' },
};

interface ShoIconProps {
  name: ShoIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function ShoIcon({
  name,
  size = 20,
  color = ShoColors.textIvory,
  style,
}: ShoIconProps) {
  const symbol = SYMBOL_MAPPING[name] || {
    ios: 'questionmark.circle',
    android: 'help',
    web: 'help',
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <SymbolView
        name={symbol}
        size={size}
        tintColor={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
