const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Ensure requireRole is imported
  if (!content.includes('requireRole')) {
    if (content.includes('checkAuth')) {
      content = content.replace(/import\s+\{\s*([^}]*?)checkAuth([^}]*?)\}\s+from\s+['"]@\/lib\/auth\/server-auth['"];/, (match, p1, p2) => {
        const imports = [p1, 'checkAuth', p2].join('').split(',').map(s => s.trim()).filter(Boolean);
        if (!imports.includes('requireRole')) imports.push('requireRole');
        return `import { ${imports.join(', ')} } from '@/lib/auth/server-auth';`;
      });
    } else {
      // Add it after the last import
      content = content.replace(/(import.*?\n)(?!import)/, `$1import { requireRole } from '@/lib/auth/server-auth';\n`);
    }
  }

  // 2. Replace checkAuth() patterns
  // Pattern 1: const user = await checkAuth();
  //            if (!user) ...
  // Pattern 2: const userContext = await checkAuth();
  //            if (!userContext || !userContext.dbUser) ...
  const checkAuthRegex = /(const\s+([a-zA-Z0-9_]+)\s*=\s*await\s+checkAuth\(\);)\s*(if\s*\(\![a-zA-Z0-9_]+(?:\s*\|\|\s*\![a-zA-Z0-9_]+\.dbUser)?\)\s*\{\s*return\s+NextResponse\.json\([^)]+\)\s*;\s*\})/g;
  
  content = content.replace(checkAuthRegex, (match, declaration, varName, ifStatement) => {
    return `const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const ${varName} = authResult.user;`;
  });

  // Short syntax if without braces: if (!user) return ...
  const checkAuthRegexShort = /(const\s+([a-zA-Z0-9_]+)\s*=\s*await\s+checkAuth\(\);)\s*(if\s*\(\![a-zA-Z0-9_]+(?:\s*\|\|\s*\![a-zA-Z0-9_]+\.dbUser)?\)\s*return\s+NextResponse\.json\([^)]+\)\s*;)/g;
  
  content = content.replace(checkAuthRegexShort, (match, declaration, varName, ifStatement) => {
    return `const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const ${varName} = authResult.user;`;
  });

  // 3. Replace supabase.auth.getUser() patterns inside route.js
  const supabaseAuthRegex = /(const\s+\{\s*data:\s*\{\s*user\s*\}\s*\}\s*=\s*await\s+supabase\.auth\.getUser\(\);)\s*(if\s*\(\!user\)\s*(?:return|\{)[^;]+;(?:\s*\})?)/g;
  content = content.replace(supabaseAuthRegex, (match, declaration, ifStatement) => {
    return `const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const user = authResult.user;`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('route.js')) {
      processFile(fullPath);
    }
  }
}

walkDir('./src/app/api/admin');
walkDir('./src/app/api/songs');
walkDir('./src/app/api/services');
console.log('Done');
