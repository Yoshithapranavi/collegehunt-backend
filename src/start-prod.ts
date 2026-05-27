import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting production server...');

    try {
        // Check if database exists and has data
        const collegeCount = await prisma.college.count();

        if (collegeCount === 0) {
            console.log('📊 Database empty. Running seed...');

            // Run seed script. Prefer compiled dist/seed.js when available.
            await new Promise<void>((resolve, reject) => {
                const seedDistPath = path.join(__dirname, 'seed.js');
                let cmd: string;
                let args: string[];

                if (fs.existsSync(seedDistPath)) {
                    cmd = 'node';
                    args = [seedDistPath];
                } else {
                    // Fallback to running the TS seed via tsx loader (dev environment)
                    cmd = 'node';
                    args = ['--loader', 'tsx/esm', path.join(__dirname, '..', 'src', 'seed.ts')];
                }

                const seed = spawn(cmd, args, {
                    stdio: 'inherit',
                    cwd: process.cwd(),
                });

                seed.on('close', (code) => {
                    if (code === 0) {
                        console.log('✅ Seed completed successfully');
                        resolve();
                    } else {
                        reject(new Error(`Seed process exited with code ${code}`));
                    }
                });
            });
        } else {
            console.log(`✅ Database ready with ${collegeCount} colleges`);
        }

        // Now start the server
        console.log('🎯 Starting API server...');
        const serverPath = path.join(__dirname, 'index.js');
        const server = spawn('node', [serverPath], {
            stdio: 'inherit',
            cwd: process.cwd(),
        });

        server.on('error', (err) => {
            console.error('❌ Server error:', err);
            process.exit(1);
        });

    } catch (error) {
        console.error('❌ Setup error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
