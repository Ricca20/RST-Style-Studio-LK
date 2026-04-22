export function calculateBudget(quoteData, pricingConfigs) {
  let total = 0;
  
  if (!pricingConfigs || !pricingConfigs.length) return total;

  if (quoteData.serviceType) {
    const serviceConfig = pricingConfigs.find(c => c.itemKey === quoteData.serviceType && c.type === 'SERVICE');
    if (serviceConfig) total += serviceConfig.price;
  }

  if (quoteData.needsMelody) {
    const melodyConfig = pricingConfigs.find(c => c.itemKey === 'MELODY_EXTRA');
    if (melodyConfig) total += melodyConfig.price;
  }
  
  if (quoteData.needsInstruments) {
    const instConfig = pricingConfigs.find(c => c.itemKey === 'INSTRUMENTS_EXTRA');
    if (instConfig) total += instConfig.price;
  }

  if (quoteData.needsMusicVideo) {
    const videoConfig = pricingConfigs.find(c => c.itemKey === 'VIDEO_BASIC');
    if (videoConfig) total += videoConfig.price;
  }

  return total;
}
  
