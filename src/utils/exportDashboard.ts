import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function findAndFixOpacityIssues(dashboard: HTMLElement): Map<HTMLElement, any> {
  const backups = new Map();
  const allElements = dashboard.querySelectorAll('*');
  
  console.log('🔍 Scanning for opacity issues...');
  let fixCount = 0;
  
  allElements.forEach((el) => {
    const element = el as HTMLElement;
    const computed = window.getComputedStyle(element);
    const classes = typeof element.className === 'string' ? element.className : '';
    
    // Backup original inline styles
    backups.set(element, {
      bg: element.style.backgroundColor,
      color: element.style.color,
      opacity: element.style.opacity,
      backdropFilter: element.style.backdropFilter,
      filter: element.style.filter,
    });
    
    // Check for Tailwind opacity utilities in classes
    const hasOpacityClass = /opacity-\d+|bg-opacity-\d+|text-opacity-\d+/.test(classes);
    const hasBackdropBlur = /backdrop-blur/.test(classes);
    const computedOpacity = parseFloat(computed.opacity);
    const hasLowOpacity = computedOpacity < 1;
    
    if (hasOpacityClass || hasBackdropBlur || hasLowOpacity) {
      console.log('Found issue:', {
        element: element.tagName,
        classes: classes.slice(0, 60),
        opacity: computedOpacity,
        hasOpacityClass,
        hasBackdropBlur
      });
      fixCount++;
    }
    
    // FORCE full opacity
    element.style.opacity = '1';
    element.style.setProperty('opacity', '1', 'important');
    
    // Remove backdrop filters
    element.style.backdropFilter = 'none';
    element.style.setProperty('backdrop-filter', 'none', 'important');
    element.style.webkitBackdropFilter = 'none';
    
    // Remove any filters
    if (computed.filter && computed.filter !== 'none') {
      element.style.filter = 'none';
    }
    
    // Fix rgba backgrounds - make them solid RGB
    const bg = computed.backgroundColor;
    if (bg && bg.includes('rgba')) {
      const match = bg.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (match) {
        const [, r, g, b, a] = match;
        const alpha = parseFloat(a);
        // Only fix if alpha is between 0.01 and 0.99 (skip fully transparent)
        if (alpha > 0.01 && alpha < 1) {
          element.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          element.style.setProperty('background-color', `rgb(${r}, ${g}, ${b})`, 'important');
          console.log(`Fixed bg: rgba(${r},${g},${b},${a}) → rgb(${r},${g},${b})`);
        }
      }
    }
    
    // Fix rgba text colors and ensure visibility
    const color = computed.color;
    if (color) {
      if (color.includes('rgba')) {
        const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (match) {
          const [, r, g, b, a] = match;
          const alpha = parseFloat(a);
          if (alpha > 0.01 && alpha < 1) {
            element.style.color = `rgb(${r}, ${g}, ${b})`;
            element.style.setProperty('color', `rgb(${r}, ${g}, ${b})`, 'important');
            console.log(`Fixed text: rgba(${r},${g},${b},${a}) → rgb(${r},${g},${b})`);
          }
        }
      }
      
      // AGGRESSIVELY lighten ALL dark text for better visibility
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        const brightness = (r + g + b) / 3;
        
        // If text brightness is below 180, make it much lighter
        if (brightness < 180) {
          const isDarkMode = document.documentElement.classList.contains('dark');
          if (isDarkMode) {
            // SUPER BRIGHT text for dark mode - add 180 for maximum visibility
            const newR = Math.min(255, r + 180);
            const newG = Math.min(255, g + 180);
            const newB = Math.min(255, b + 180);
            element.style.color = `rgb(${newR}, ${newG}, ${newB})`;
            element.style.setProperty('color', `rgb(${newR}, ${newG}, ${newB})`, 'important');
            console.log(`💡 Brightened text: rgb(${r},${g},${b}) → rgb(${newR},${newG},${newB})`);
          }
        }
      }
    }
    
    // FORCE visibility on ALL text elements
    const isTextElement = /text|label|legend|title|name|span|p|h1|h2|h3|h4|h5|h6/i.test(element.className) || 
                         element.tagName === 'SPAN' || 
                         element.tagName === 'P' ||
                         element.tagName === 'LABEL' ||
                         element.tagName === 'DIV' && element.textContent && element.textContent.trim().length > 0;
    
    if (isTextElement) {
      element.style.opacity = '1';
      element.style.setProperty('opacity', '1', 'important');
      
      // Add text shadow for better visibility
      if (!element.style.textShadow) {
        element.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
      }
      
      // Ensure font weight is visible
      const fontWeight = computed.fontWeight;
      if (parseInt(fontWeight) < 400) {
        element.style.fontWeight = '500';
      }
    }
  });
  
  console.log(`✅ Fixed ${fixCount} elements with opacity issues`);
  return backups;
}

function restoreOriginal(backups: Map<HTMLElement, any>) {
  backups.forEach((backup, element) => {
    const el = element as HTMLElement;
    el.style.backgroundColor = backup.bg;
    el.style.color = backup.color;
    el.style.opacity = backup.opacity;
    el.style.backdropFilter = backup.backdropFilter;
    el.style.filter = backup.filter;
    
    // Remove important flags
    el.style.removeProperty('opacity');
    el.style.removeProperty('backdrop-filter');
    el.style.removeProperty('background-color');
    el.style.removeProperty('color');
  });
  console.log('🔄 Restored original styles');
}

export async function exportDashboardAsPDF() {
  const dashboard = document.querySelector('.max-w-7xl') as HTMLElement;

  if (!dashboard) {
    throw new Error('Dashboard element not found');
  }

  console.log('📊 Starting PDF export...');

  const isDarkMode = document.documentElement.classList.contains('dark');
  const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';

  const originalOverflow = document.body.style.overflow;
  const originalDashboardOverflow = dashboard.style.overflow;
  
  document.body.style.overflow = 'visible';
  dashboard.style.overflow = 'visible';
  window.scrollTo(0, 0);
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Find and fix all opacity issues
  const backups = findAndFixOpacityIssues(dashboard);
  
  // Wait for all fixes to apply
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const fullWidth = Math.max(
      dashboard.scrollWidth,
      dashboard.offsetWidth,
      dashboard.clientWidth
    );
    
    const fullHeight = Math.max(
      dashboard.scrollHeight,
      dashboard.offsetHeight,
      dashboard.clientHeight
    );

    console.log('📸 Capturing canvas:', { width: fullWidth, height: fullHeight });

    const canvas = await html2canvas(dashboard, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true, // Enable to see html2canvas logs
      backgroundColor: backgroundColor,
      width: fullWidth,
      height: fullHeight,
      windowWidth: fullWidth,
      windowHeight: fullHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });

    console.log('✅ Canvas created:', { width: canvas.width, height: canvas.height });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgWidth = pdfWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - margin * 2);

    while (heightLeft > 0) {
      pdf.addPage();
      position = -(imgHeight - heightLeft) + margin;
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - margin * 2);
    }

    const timestamp = new Date().toISOString().split('T')[0];
    pdf.save(`markivate-dashboard-report-${timestamp}.pdf`);
    
    console.log('✅ PDF SAVED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    restoreOriginal(backups);
    document.body.style.overflow = originalOverflow;
    dashboard.style.overflow = originalDashboardOverflow;
  }
}

export async function exportDashboardAsImage() {
  const dashboard = document.querySelector('.max-w-7xl') as HTMLElement;

  if (!dashboard) {
    throw new Error('Dashboard element not found');
  }

  console.log('🖼️ Starting image export...');

  const isDarkMode = document.documentElement.classList.contains('dark');
  const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';

  const originalOverflow = document.body.style.overflow;
  const originalDashboardOverflow = dashboard.style.overflow;
  
  document.body.style.overflow = 'visible';
  dashboard.style.overflow = 'visible';
  window.scrollTo(0, 0);
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const backups = findAndFixOpacityIssues(dashboard);
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const fullWidth = Math.max(
      dashboard.scrollWidth,
      dashboard.offsetWidth,
      dashboard.clientWidth
    );
    
    const fullHeight = Math.max(
      dashboard.scrollHeight,
      dashboard.offsetHeight,
      dashboard.clientHeight
    );

    const canvas = await html2canvas(dashboard, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: backgroundColor,
      width: fullWidth,
      height: fullHeight,
      windowWidth: fullWidth,
      windowHeight: fullHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      a.download = `markivate-dashboard-${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('✅ IMAGE SAVED SUCCESSFULLY!');
    }, 'image/png', 1.0);
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    restoreOriginal(backups);
    document.body.style.overflow = originalOverflow;
    dashboard.style.overflow = originalDashboardOverflow;
  }
}